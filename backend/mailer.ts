import { createTransport, Transporter } from "nodemailer";

export class Mailer {
  private transporter: Transporter;

  constructor(user: string, pass: string) {
    this.transporter = createTransport({
      host: "smtppro.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
    });
  }

  async sendRecommendation(
    type: "crop" | "animal",
    recipientEmailAddress: string,
    recipientName: string,
    recommendations: any[]
  ) {
    const info = await this.transporter.sendMail({
      from: '"Pedigree" <pedigree@halogenapps.com>', // sender address
      to: recipientEmailAddress, // list of receivers
      subject: `Recommendation for best ${recommendations[0][
        type
      ].name.toLowerCase()} ${type === "crop" ? "cultivars" : "breeds"}`,
      html:
        type === "crop"
          ? this.composeBodyForCultivarRecommendation(
              recipientName,
              recommendations
            )
          : this.composeBodyForBreedRecommendation(
              recipientName,
              recommendations
            ),
    });

    return info;
  }

  private composeBodyForBreedRecommendation(
    recipientName: string,
    recommendations: any[]
  ) {
    return `
      <p>Good day ${recipientName}</p>
      <p>
        Based on the parameters you provided on our website. Here's our list of the best ${recommendations[0].animal.name.toLowerCase()} breeds to invest in.
      </p>

      ${recommendations
        .map(
          ({
            name,
            animal,
            supplier,
            min_temp,
            max_temp,
            daily_water,
            daily_feed,
            annual_fertility_rate,
            diseases,
            pests,
            expected_product_yields,
          }: any) => {
            return `
            <h2>${name}</h2>
            <p><strong>Breed Name:</strong> ${name}</p>
            <p><strong>Animal:</strong> ${animal.name}</p>
            <p><strong>Supplier:</strong> ${supplier.name} (${supplier.email}) 
            </p>
            <p><strong>Temperature:</strong> ${min_temp} °C - ${max_temp}°C</p>
            <p><strong>Water Consumption:</strong> ${daily_water} litres</p>
            <p><strong>Food Consumption:</strong> ${daily_feed} kg</p>
            <p><strong>Annual Fertility Rate Per Female:</strong> ${annual_fertility_rate} offspring</p>
            <h3>Diseases</h3>
            ${diseases
              .map(
                ({
                  disease,
                  disease_incidence_likelihood,
                  precautions,
                  treatment,
                }: any) => {
                  return `
                  <p><strong>Disease Name:</strong> ${disease.name}</p>
                  <p><strong>Disease Incidence Likelihood:</strong> ${
                    disease_incidence_likelihood.name
                  }</p>
                  <h4>Precautions:</h4>
                  <p>${precautions || "n/a"}</p>
                  <h4>Treatment:</h4>
                  <p>${treatment || "n/a"}</p>`;
                }
              )
              .join("")}
            <h3>Pests</h3>
            ${pests
              .map(
                ({
                  pest,
                  pest_incidence_likelihood,
                  precautions,
                  treatment,
                }: any) => {
                  return `
                    <p><strong>Pest Name:</strong> ${pest.name}</p>
                    <p><strong>Pest Incidence Likelihood:</strong> ${
                      pest_incidence_likelihood.name
                    }</p>
                    <h4>Precautions:</h4>
                    <p>${precautions || "n/a"}</p>
                    <h4>Treatment:</h4>
                    <p>${treatment || "n/a"}</p>
                  `;
                }
              )
              .join("")}
            <h3>Expected Production</h3>
            ${expected_product_yields
              .map(
                ({ product, average_quantity_produced, product_unit }: any) => {
                  return `
                  <p><strong>${
                    product.name
                  }:</strong> ${average_quantity_produced} ${
                    average_quantity_produced === 1
                      ? product_unit.name
                      : product_unit.plural_name
                  }</p>`;
                }
              )
              .join(",")}
            `;
          }
        )
        .join("<br/>")}
      <br/>
      <p>We wish you all the best</p>
      <br/>
      <p>The Pedigree Team</p>
    `;
  }

  // Write a function to create an HTML body
  private composeBodyForCultivarRecommendation(
    recipientName: string,
    recommendations: any[]
  ) {
    return `
    <p>Good day ${recipientName}</p>

    <p>
    Based on the parameters you provided on our website. Here's our list of the best ${recommendations[0].crop.name.toLowerCase()} cultivars to invest in.
    </p>

      ${recommendations
        .map(
          ({
            name,
            crop,
            supplier,
            min_temp,
            max_temp,
            min_daily_irrigation,
            max_daily_irrigation,
            min_annual_cold_hours,
            max_annual_cold_hours,
            min_soil_pH,
            max_soil_pH,
            soil_type,
            diseases,
            pests,
            fertiliser_applications,
            expected_product_yields,
          }: any) => {
            return `
          <h2>${name}</h2>
          <p><strong>Variety Name:</strong> ${name}</p>
          <p><strong>Crop Name:</strong> ${crop.name}</p>
          <p><strong>Supplier:</strong> ${supplier.name} (${supplier.email})</p>
          <p><strong>Temperature:</strong> ${min_temp} °C - ${max_temp}°C</p>
          <p><strong>Daily Water Intake:</strong> ${min_daily_irrigation} mm - ${max_daily_irrigation} mm</p>
          <p><strong>Annual Cold Hours:</strong> ${min_annual_cold_hours} hrs - ${max_annual_cold_hours} hrs</p>
          <p><strong>Soil pH:</strong> ${min_soil_pH} - ${max_soil_pH}</p>
          <p><strong>Ideal Soil Type:</strong> ${soil_type.name}</p>
          <br/>
          <h3>Diseases</h3>
          ${diseases
            .map(
              ({
                disease,
                disease_incidence_likelihood,
                precautions,
                treatment,
              }: any) => {
                return `
                <p><strong>Disease Name:</strong> ${disease.name}</p>
                <p><strong>Disease Incidence Likelihood:</strong> ${
                  disease_incidence_likelihood.name
                }</p>
                <h4>Precautions:</h4>
                <p>${precautions || "n/a"}</p>
                <h4>Treatment:</h4>
                <p>${treatment || "n/a"}</p>`;
              }
            )
            .join("")}
            <br/>
          <h3>Pests</h3>
          ${pests
            .map(
              ({
                pest,
                pest_incidence_likelihood,
                precautions,
                treatment,
              }: any) => {
                return `
                <p><strong>Pest Name:</strong> ${pest.name}</p>
                <p><strong>Pest Incidence Likelihood:</strong> ${
                  pest_incidence_likelihood.name
                }</p>
                <h4>Precautions:</h4>
                <p>${precautions || "n/a"}</p>
                <h4>Treatment:</h4>
                <p>${treatment || "n/a"}</p>
             `;
              }
            )
            .join("")}
            <br/>
          <h3>Fertiliser Applications</h3>
          ${fertiliser_applications
            .map(
              ({
                fertiliser,
                milestone_for_application,
                quantity_per_plant,
              }: any) => {
                return `
                <p><strong>Fertiliser Name:</strong> ${fertiliser.name}</p>
                <p><strong>Milestone for Application:</strong> ${milestone_for_application}</p>
                <p><strong>Quantity per Plant (g):</strong> ${quantity_per_plant} g</p>
              `;
              }
            )
            .join()}
            <br/>
          <h3>Expected Yields</h3>
          ${expected_product_yields
            .map(
              ({ product, average_quantity_produced, product_unit }: any) => {
                return `
                <p><strong>${
                  product.name
                }:</strong> ${average_quantity_produced} ${
                  average_quantity_produced === 1
                    ? product_unit.name
                    : product_unit.plural_name
                }</p>`;
              }
            )
            .join()}
        `;
          }
        )
        .join("<br/>")}
    </ol>
    <br/>
    <p>We wish you all the best</p>
    <br/>
    <p>The Pedigree Team</p>
    `;
  }

  async sendPasswordResetLink(supplierEmail: string, resetLink: string) {
    const info = await this.transporter.sendMail({
      from: '"Pedigree" <pedigree@halogenapps.com>',
      to: supplierEmail,
      subject: "Password Reset",
      html: `
        Click the link below to reset your password<br/>
        <a href="${resetLink}">Reset Password</a>

        <br/>
        <p>If clicking does not work, copy and paste the link below into your browser</p>
        <p>${resetLink}</p>

        <p>Link will expire in 30 minutes.</p>
        <p>If you did not request a password reset, please ignore this email</p>
      `,
    });

    return info;
  }
}
