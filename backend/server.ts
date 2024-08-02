import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { SessionManager } from "./sessions";
import { config } from "dotenv";
import { Mailer } from "./mailer";
import { v4 as uuid } from "uuid";
import { filterDuplicateRequests } from "./middleware";
config();

export function createServer(
  sessions: SessionManager,
  verifyAuth: any,
  env: string = "development"
) {
  const SALT_ROUNDS = 10;

  const prisma = new PrismaClient();

  const mailer = new Mailer(
    process.env.EMAIL as string,
    process.env.PASSWORD as string
  );

  const app = express();
  app.use(express.json());

  app.post("/api/crop/recommendation", async (req, res) => {
    const {
      name,
      email,
      crop_id,
      min_temp,
      max_temp,
      most_important_product_id,
      soil_type_id,
    } = req.body;

    const cultivars = await prisma.cultivar.findMany({
      where: {
        crop_id: {
          equals: crop_id,
        },
        min_temp: {
          lte: min_temp,
        },
        max_temp: {
          gte: max_temp,
        },
        soil_type_id: {
          equals: soil_type_id,
        },
        expected_product_yields: {
          some: {
            product_id: {
              equals: most_important_product_id,
            },
          },
        },
      },
      include: {
        supplier: true,
        soil_type: true,
        crop: true,
        diseases: {
          include: {
            disease: true,
            disease_incidence_likelihood: true,
          },
        },
        pests: {
          include: {
            pest: true,
            pest_incidence_likelihood: true,
          },
        },
        fertiliser_applications: {
          include: {
            fertiliser: true,
          },
        },
        expected_product_yields: {
          include: {
            product: true,
            product_unit: true,
          },
        },
      },
    });

    if (cultivars.length > 0) {
      await mailer.sendRecommendation("crop", email, name, cultivars);
    }

    res.json(cultivars);
  });

  app.post("/api/animal/recommendation", async (req, res) => {
    const {
      name,
      email,
      animal_id,
      min_temp,
      max_temp,
      most_important_product_id,
    } = req.body;

    const breeds = await prisma.breed.findMany({
      where: {
        animal_id: {
          equals: animal_id,
        },
        min_temp: {
          lte: min_temp,
        },
        max_temp: {
          gte: max_temp,
        },
        expected_product_yields: {
          some: {
            product_id: {
              equals: most_important_product_id,
            },
          },
        },
      },
      include: {
        supplier: true,
        animal: true,
        diseases: {
          include: {
            disease: true,
            disease_incidence_likelihood: true,
          },
        },
        pests: {
          include: {
            pest: true,
            pest_incidence_likelihood: true,
          },
        },
        expected_product_yields: {
          include: {
            product: true,
            product_unit: true,
          },
        },
      },
    });

    if (breeds.length > 0) {
      await mailer.sendRecommendation("animal", email, name, breeds);
    }

    res.status(200).json(breeds);
  });

  app.post("/api/create-supplier", async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const supplier = await prisma.supplier.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.json(supplier);
  });

  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    // Get supplier from database
    const supplier = await prisma.supplier.findFirst({
      where: {
        email: {
          equals: email,
        },
      },
    });

    // Check if supplier exists from database
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Supplier exists in the database, so we check the password
    bcrypt.compare(password, supplier.password, async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }

      if (!result) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Password is correct, so we create a session
      const token = uuid();
      await sessions.createSession(token, supplier.id);
      res.json({ token });
    });
  });

  app.post("/api/forgot-password", async (req, res) => {
    const { email, frontendUrl } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email field is missing" });
    }

    const supplier = prisma.supplier.findFirst({
      where: { email: { equals: email } },
    });

    if (!supplier) {
      return res
        .status(404)
        .json({ message: "Supplier with specified email could not be found" });
    }

    const token = uuid();
    const expiration_date = new Date(Date.now() + 1000 * 60 * 30);

    await prisma.supplier.update({
      where: {
        email,
      },
      data: {
        password_reset_token: String(token),
        password_reset_token_expiration: expiration_date,
      },
    });

    const resetLink = `${frontendUrl}?token=${token}`;

    await mailer.sendPasswordResetLink(email, resetLink);

    res.status(200).json({ message: "Reset link sent" });
  });

  app.post("/api/reset-password", async (req, res) => {
    const token = req.body.token as string;
    const password = req.body.password as string;

    /*  Make sure token is never empty otherwise you will reset the password for all
        users do not have a password_reset_token because they didn't request a password reset
    */
    if (token === "") {
      return res.status(400).json({ message: "Token cannot be empty" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const supplier = await prisma.supplier.findFirst({
      where: {
        password_reset_token: {
          equals: token,
        },
      },
    });

    if (!supplier) {
      return res
        .status(404)
        .json({ message: "Could not find supplier with specified token" });
    }

    if (
      Date.now() > Number(supplier.password_reset_token_expiration?.getTime())
    ) {
      return res.status(401).json({ message: "Token expired" });
    }

    await prisma.supplier.update({
      where: {
        email: supplier.email,
      },
      data: {
        password: hashedPassword,
        password_reset_token: null,
        password_reset_token_expiration: null,
      },
    });

    res.status(200).json({ message: "Password reset succesful" });
  });

  app.get("/api/form-options", async (req, res) => {
    // List of tables that provide form options
    const tables = [
      "disease",
      "product",
      "pest",
      "likelihood",
      "animal",
      "crop",
      "soilType",
      "fertiliser",
      "sIUnit",
      "conventionalUnit",
    ];

    // Getting the data for all tables
    const data = await Promise.all(
      //@ts-ignore
      tables.map((table) => prisma[table].findMany())
    );

    // Creating a form options object
    const formOptions = new Object();

    // Assigning the data to the form options object
    for (let i = 0; i < tables.length; i++) {
      const key = tables[i];
      const value = data[i];

      // @ts-ignore
      formOptions[key] = value;
    }

    res.status(200).json(formOptions);
  });

  app.get("/api/supplier", verifyAuth, async (req, res) => {
    const supplierId = res.locals.supplierId;

    // Get the supplier from the database
    const supplier = await prisma.supplier.findUnique({
      where: {
        id: supplierId,
      },
      include: {
        cultivars: true,
        breeds: true,
      },
    });

    // Check if the supplier exists in the database
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Return the supplier
    res.json(supplier);
  });

  app.get("/api/breeds", verifyAuth, async (req, res) => {
    const supplierId = res.locals.supplierId;

    // Get the supplier from the database
    const breeds = await prisma.breed.findMany({
      where: {
        supplier_id: {
          equals: supplierId,
        },
      },
      include: {
        animal: true,
        diseases: true,
        pests: true,
        expected_product_yields: true,
      },
    });

    // Return the breeds
    res.json(breeds);
  });

  app.get("/api/cultivars", verifyAuth, async (req, res) => {
    const supplierId = res.locals.supplierId;

    // Get the supplier from the database
    const cultivars = await prisma.cultivar.findMany({
      where: {
        supplier_id: {
          equals: supplierId,
        },
      },

      include: {
        crop: true,
        diseases: true,
        pests: true,
        fertiliser_applications: true,
        expected_product_yields: true,
      },
    });

    // Return the cultivars
    res.json(cultivars);
  });

  app.post("/api/breeds", verifyAuth, async (req, res) => {
    const supplierId = res.locals.supplierId;

    const {
      name,
      animal_id,
      daily_feed,
      daily_water,
      min_temp,
      max_temp,
      annual_fertility_rate,
      expected_product_yields,
      diseases,
      pests,
    } = req.body;

    const breed = await prisma.breed.create({
      data: {
        name,
        daily_feed,
        daily_water,
        min_temp,
        max_temp,
        annual_fertility_rate,
        supplier_id: supplierId,
        animal_id,
        diseases: {
          create: diseases.map((disease: any) => {
            return {
              treatment: disease.treatment,
              precautions: disease.precautions,
              disease_incidence_likelihood: {
                connect: {
                  id: disease.disease_incidence_likelihood_id,
                },
              },
              disease: {
                connect: {
                  id: disease.disease_id,
                },
              },
            };
          }),
        },
        pests: {
          create: pests.map((pest: any) => ({
            treatment: pest.treatment,
            precautions: pest.precautions,
            pest_incidence_likelihood: {
              connect: {
                id: pest.pest_incidence_likelihood_id,
              },
            },
            pest: {
              connect: {
                id: pest.pest_id,
              },
            },
          })),
        },
        expected_product_yields: {
          create: expected_product_yields.map((expectedProductYield: any) => {
            return {
              average_quantity_produced:
                expectedProductYield.average_quantity_produced,
              product: {
                connect: {
                  id: expectedProductYield.product_id,
                },
              },
              product_unit: {
                connect: {
                  id: expectedProductYield.product_unit_id,
                },
              },
            };
          }),
        },
      },
    });

    res.json(breed);
  });

  app.post("/api/cultivars", verifyAuth, async (req, res) => {
    const supplierId = res.locals.supplierId;

    const {
      name,
      crop_id,
      min_temp,
      max_temp,
      min_daily_irrigation,
      max_daily_irrigation,
      min_annual_cold_hours,
      max_annual_cold_hours,
      min_soil_pH,
      max_soil_pH,
      soil_type_id,
      diseases,
      pests,
      expected_product_yields,
      fertiliser_applications,
    } = req.body;

    const cultivar = await prisma.cultivar.create({
      data: {
        name,
        crop_id,
        min_temp,
        max_temp,
        min_daily_irrigation,
        max_daily_irrigation,
        min_annual_cold_hours,
        max_annual_cold_hours,
        min_soil_pH,
        max_soil_pH,
        soil_type_id,
        supplier_id: supplierId,

        diseases: {
          create: diseases.map((disease: any) => {
            return {
              treatment: disease.treatment,
              precautions: disease.precautions,
              disease_incidence_likelihood: {
                connect: {
                  id: disease.disease_incidence_likelihood_id,
                },
              },
              disease: {
                connect: {
                  id: disease.disease_id,
                },
              },
            };
          }),
        },

        pests: {
          create: pests.map((pest: any) => {
            return {
              treatment: pest.treatment,
              precautions: pest.precautions,
              pest_incidence_likelihood: {
                connect: {
                  id: pest.pest_incidence_likelihood_id,
                },
              },
              pest: {
                connect: {
                  id: pest.pest_id,
                },
              },
            };
          }),
        },

        expected_product_yields: {
          create: expected_product_yields.map((expectedProductYield: any) => {
            return {
              average_quantity_produced:
                expectedProductYield.average_quantity_produced,
              product: {
                connect: {
                  id: expectedProductYield.product_id,
                },
              },
              product_unit: {
                connect: {
                  id: expectedProductYield.product_unit_id,
                },
              },
            };
          }),
        },

        fertiliser_applications: {
          create: fertiliser_applications.map((fertiliserApplication: any) => {
            return {
              quantity_per_plant: fertiliserApplication.quantity_per_plant,
              milestone_for_application:
                fertiliserApplication.milestone_for_application,
              fertiliser: {
                connect: {
                  id: fertiliserApplication.fertiliser_id,
                },
              },
            };
          }),
        },
      },
    });

    res.json(cultivar);
  });

  app.put("/api/cultivars", verifyAuth, async (req, res) => {
    const supplierId = res.locals.supplierId;

    const {
      id,
      name,
      crop_id,
      min_temp,
      max_temp,
      min_daily_irrigation,
      max_daily_irrigation,
      min_annual_cold_hours,
      max_annual_cold_hours,
      min_soil_pH,
      max_soil_pH,
      soil_type_id,
      diseases,
      pests,
      expected_product_yields,
      fertiliser_applications,
    } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Required id field is missing." });
    }

    const cultivar = await prisma.cultivar.findFirst({
      where: { id: { equals: id } },
    });

    if (!cultivar) {
      return res
        .status(404)
        .json({ message: "Resource to update could not be found." });
    }

    if (cultivar.supplier_id != supplierId) {
      return res.status(403).json({
        message: "You do not have the authorisation to modify this record",
      });
    }

    await prisma.cultivar.update({
      where: {
        id,
      },
      data: {
        name,
        crop_id,
        min_temp,
        max_temp,
        min_daily_irrigation,
        max_daily_irrigation,
        min_annual_cold_hours,
        max_annual_cold_hours,
        min_soil_pH,
        max_soil_pH,
        soil_type_id,
        fertiliser_applications: {
          deleteMany: {
            cultivar_id: {
              equals: id,
            },
          },
          createMany: {
            data: fertiliser_applications.map((fertiliserApplication: any) => ({
              quantity_per_plant: fertiliserApplication.quantity_per_plant,
              milestone_for_application:
                fertiliserApplication.milestone_for_application,
              fertiliser_id: fertiliserApplication.fertiliser_id,
            })),
          },
        },
        diseases: {
          deleteMany: {
            cultivar_id: {
              equals: id,
            },
          },
          createMany: {
            data: diseases.map((disease: any) => ({
              treatment: disease.treatment,
              precautions: disease.precautions,
              disease_incidence_likelihood_id:
                disease.disease_incidence_likelihood_id,
              disease_id: disease.disease_id,
            })),
          },
        },
        pests: {
          deleteMany: {
            cultivar_id: {
              equals: id,
            },
          },
          createMany: {
            data: pests.map((pest: any) => ({
              treatment: pest.treatment,
              precautions: pest.precautions,
              pest_incidence_likelihood_id: pest.pest_incidence_likelihood_id,
              pest_id: pest.pest_id,
            })),
          },
        },
        expected_product_yields: {
          deleteMany: {
            cultivar_id: {
              equals: id,
            },
          },
          createMany: {
            data: expected_product_yields.map((expectedProductYield: any) => ({
              average_quantity_produced:
                expectedProductYield.average_quantity_produced,
              product_id: expectedProductYield.product_id,
              product_unit_id: expectedProductYield.product_unit_id,
            })),
          },
        },
      },
    });

    res.status(200).json({ message: "All went well" });
  });

  app.put("/api/breeds", verifyAuth, async (req, res) => {
    const supplierId = res.locals.supplierId;

    const {
      id,
      name,
      animal_id,
      daily_feed,
      daily_water,
      min_temp,
      max_temp,
      annual_fertility_rate,
      expected_product_yields,
      diseases,
      pests,
    } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Required id field is missing." });
    }

    const breed = await prisma.breed.findFirst({
      where: { id: { equals: id } },
    });

    if (!breed) {
      return res
        .status(404)
        .json({ message: "Resource to update could not be found." });
    }

    if (breed.supplier_id != supplierId) {
      return res.status(403).json({
        message: "You do not have the authorisation to modify this record",
      });
    }

    await prisma.breed.update({
      where: {
        id,
      },
      data: {
        name,
        min_temp,
        max_temp,
        animal_id,
        daily_feed,
        daily_water,
        annual_fertility_rate,
        diseases: {
          deleteMany: {
            breed_id: {
              equals: id,
            },
          },
          createMany: {
            data: diseases.map((disease: any) => ({
              treatment: disease.treatment,
              precautions: disease.precautions,
              disease_incidence_likelihood_id:
                disease.disease_incidence_likelihood_id,
              disease_id: disease.disease_id,
            })),
          },
        },
        pests: {
          deleteMany: {
            breed_id: {
              equals: id,
            },
          },
          createMany: {
            data: pests.map((pest: any) => ({
              treatment: pest.treatment,
              precautions: pest.precautions,
              pest_incidence_likelihood_id: pest.pest_incidence_likelihood_id,
              pest_id: pest.pest_id,
            })),
          },
        },
        expected_product_yields: {
          deleteMany: {
            breed_id: {
              equals: id,
            },
          },
          createMany: {
            data: expected_product_yields.map((expectedProductYield: any) => ({
              average_quantity_produced:
                expectedProductYield.average_quantity_produced,
              product_id: expectedProductYield.product_id,
              product_unit_id: expectedProductYield.product_unit_id,
            })),
          },
        },
      },
    });

    res.status(200).json({ message: "All went well" });
  });

  app.delete("/api/cultivars", verifyAuth, async (req, res) => {
    const supplierId = res.locals.supplierId;

    const id = req.body.id;
    if (!id) {
      return res.status(400).json({ message: "Required id field is missing." });
    }

    const cultivar = await prisma.cultivar.findFirst({
      where: { id: { equals: id } },
    });

    if (!cultivar) {
      return res
        .status(404)
        .json({ message: "Specified resource could not be found." });
    }

    if (cultivar.supplier_id === supplierId) {
      await prisma.cultivar.delete({
        where: {
          id: id,
        },
      });
      return res.status(200).json({ message: "Deleted successfully." });
    } else {
      return res.status(403).json({
        message: "You do not have authorisation to delete requested resource",
      });
    }
  });

  app.delete("/api/breeds", verifyAuth, async (req, res) => {
    const supplierId = res.locals.supplierId;

    const id = req.body.id;
    if (!id) {
      return res.status(400).json({ message: "Required id field is missing." });
    }

    const breed = await prisma.breed.findFirst({
      where: { id: { equals: id } },
    });

    if (!breed) {
      return res
        .status(404)
        .json({ message: "Specified resource could not be found." });
    }

    if (breed.supplier_id === supplierId) {
      await prisma.breed.delete({
        where: {
          id: id,
        },
      });
      return res.status(200).json({ message: "Deleted successfully." });
    } else {
      return res.status(403).json({
        message: "You do not have authorisation to delete requested resource",
      });
    }
  });

  if (env === "production") {
    console.log("Running server in production");

    // Static frontend folder
    const dist = "frontend/dist";

    // Serving middleware
    app.use(express.static("frontend/dist"));

    // Sending index.html
    app.get("/*", (req, res) => {
      res.sendFile(`${process.cwd()}/${dist}/index.html`);
    });
  }

  return app;
}
