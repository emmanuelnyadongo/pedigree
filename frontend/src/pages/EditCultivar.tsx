import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "react-redux";
import { createOptions } from "../utils";
import { useState } from "react";
import { createFormHelpers, createInitialState } from "../utils";
import {
  Page,
  Form,
  FormLayout,
  TextField,
  Select,
  Button,
  Text,
  Layout,
} from "@shopify/polaris";
import {
  DiseaseForm,
  PestForm,
  ExpectedProductYieldForm,
  FertiliserApplicationForm,
} from "../components";
import { authenticatedFetch } from "../apiHelpers";
import toast from "react-hot-toast";

export function EditCultivar() {
  const navigate = useNavigate();
  const store = useStore();
  const params = useParams();

  // @ts-ignore
  const { formOptions, cultivars } = store.getState();
  const initialState =
    params.id == "new"
      ? createInitialState("cultivar")
      : JSON.parse(
          JSON.stringify(
            cultivars.find((cultivar: any) => cultivar.id == params.id)
          )
        );

  const [cultivar, setCultivar] = useState(initialState);

  const { addItem, updateItem, deleteItem, updateProperty } = createFormHelpers(
    cultivar,
    setCultivar
  );
  const handleSubmit = () => {
    const toastId = toast.loading("Saving cultivar...");
    authenticatedFetch("/api/cultivars", {
      method: params.id === "new" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...cultivar,
        id: params.id === "new" ? undefined : params.id,
      }),
    })
      .then((response) => {
        toast.dismiss(toastId);
        if (response.ok) {
          toast.success("Cultivar saved successfully.");
        } else {
          toast.error("An error occurred. Please try again.");
        }
        navigate("/suppliers/");
      })
      .catch(() => {
        toast.error("Check your network and try again.");
        alert("Error creating cultivar");
      });
  };

  const handleDelete = () => {
    navigate(`/suppliers/delete/cultivars/${params.id}`);
  };

  return (
    <Page
      title="Cultivar Information"
      backAction={{ content: "Back", onAction: () => navigate("/suppliers") }}
    >
      <Layout>
        <Layout.Section>
          <Form onSubmit={handleSubmit}>
            <FormLayout>
              <TextField
                value={cultivar.name}
                onChange={(value) => updateProperty("name", value)}
                label="Cultivar Name"
                autoComplete="none"
              ></TextField>
              <Select
                value={cultivar.crop_id}
                onChange={(value) => updateProperty("crop_id", value)}
                label="Crop"
                options={createOptions(formOptions.crop)}
              ></Select>
              <TextField
                label="Minimum Temperature Requirement (°C)"
                autoComplete="none"
                type="number"
                value={cultivar.min_temp}
                onChange={(value) => {
                  updateProperty("min_temp", Number(value));
                }}
              ></TextField>
              <TextField
                label="Max Temperature Requirement (°C)"
                autoComplete="none"
                type="number"
                value={cultivar.max_temp}
                onChange={(value) => {
                  updateProperty("max_temp", Number(value));
                }}
              ></TextField>
              <TextField
                label="Min Daily Irrigation (ml)"
                autoComplete="none"
                type="number"
                value={cultivar.min_daily_irrigation}
                onChange={(value) => {
                  updateProperty("min_daily_irrigation", Number(value));
                }}
              ></TextField>
              <TextField
                label="Max Daily Irrigation (ml)"
                autoComplete="none"
                type="number"
                value={cultivar.max_daily_irrigation}
                onChange={(value) => {
                  updateProperty("max_daily_irrigation", Number(value));
                }}
              ></TextField>
              <TextField
                label="Min Annual Cold Hours"
                autoComplete="none"
                type="number"
                value={cultivar.min_annual_cold_hours}
                onChange={(value) => {
                  updateProperty("min_annual_cold_hours", Number(value));
                }}
              ></TextField>
              <TextField
                label="Max Annual Cold Hours"
                autoComplete="none"
                type="number"
                value={cultivar.max_annual_cold_hours}
                onChange={(value) => {
                  updateProperty("max_annual_cold_hours", Number(value));
                }}
              ></TextField>
              <TextField
                value={cultivar.min_soil_pH}
                onChange={(value) =>
                  updateProperty("min_soil_pH", Number(value))
                }
                label="Min Soil pH"
                autoComplete="none"
                type="number"
              ></TextField>
              <TextField
                value={cultivar.max_soil_pH}
                onChange={(value) =>
                  updateProperty("max_soil_pH", Number(value))
                }
                label="Max Soil pH"
                autoComplete="none"
                type="number"
              ></TextField>
              <Select
                label="Soil Type"
                options={createOptions(formOptions.soilType)}
                value={cultivar.soil_type_id}
                onChange={(value) => updateProperty("soil_type_id", value)}
              ></Select>
              <Text as="p" variant="headingSm">
                Expected Product Yields
              </Text>
              {cultivar.expected_product_yields.map(
                (product_yield: any, index: number) => {
                  return (
                    <ExpectedProductYieldForm
                      product_yield={product_yield}
                      key={index}
                      index={index}
                      updateItem={updateItem}
                      deleteItem={deleteItem}
                      formOptions={formOptions}
                    />
                  );
                }
              )}
              <Button
                variant="secondary"
                onClick={() => addItem("expected_product_yields")}
              >
                Add product
              </Button>
              <Text as="p" variant="headingSm">
                Diseases
              </Text>
              {cultivar.diseases.map((disease: any, index: number) => {
                return (
                  <DiseaseForm
                    disease={disease}
                    key={index}
                    index={index}
                    updateItem={updateItem}
                    deleteItem={deleteItem}
                    formOptions={formOptions}
                  />
                );
              })}
              <Button
                onClick={() => {
                  addItem("diseases");
                }}
              >
                Add Disease
              </Button>
              <Text as="p" variant="headingSm">
                Pests
              </Text>
              {cultivar.pests.map((pest: any, index: number) => {
                return (
                  <PestForm
                    pest={pest}
                    key={index}
                    index={index}
                    updateItem={updateItem}
                    deleteItem={deleteItem}
                    formOptions={formOptions}
                  />
                );
              })}
              <Button
                onClick={() => {
                  addItem("pests");
                }}
              >
                Add Pest
              </Button>
              <Text as="p" variant="headingSm">
                Fertiliser Applications
              </Text>
              {cultivar.fertiliser_applications.map(
                (fertiliser: any, index: number) => {
                  return (
                    <FertiliserApplicationForm
                      fertiliserApplication={fertiliser}
                      key={index}
                      index={index}
                      updateItem={updateItem}
                      deleteItem={deleteItem}
                      formOptions={formOptions}
                    />
                  );
                }
              )}
              <Button
                onClick={() => {
                  addItem("fertiliser_applications");
                }}
              >
                Add Fertiliser Application
              </Button>
            </FormLayout>
            <br />
            <Button variant="primary" submit>
              Save
            </Button>{" "}
            {params.id != "new" && (
              <Button variant="secondary" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </Form>
          <br />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
