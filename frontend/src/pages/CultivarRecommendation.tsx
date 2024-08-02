import { getFormOptions } from "../apiHelpers";
import { useNavigate } from "react-router-dom";
import { createOptions, createFormHelpers } from "../utils";
import { useState, useEffect } from "react";
import {
  Page,
  Form,
  Text,
  Card,
  FormLayout,
  TextField,
  Select,
  Button,
  Modal,
  List,
  Layout,
} from "@shopify/polaris";
import toast from "react-hot-toast";

export function CultivarRecommendation() {
  const [recommendationFormData, setRecommendationFormData] = useState(
    {} as any
  );
  const [recommendations, setRecommendations] = useState([]);
  const [formOptions, setFormOptions] = useState({} as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const onMount = () => {
    getFormOptions()
      .then((data: any) => {
        setFormOptions(data);
        setLoading(false);
      })
      .catch((error: any) => {
        console.log(error);
        setError(true);
        setLoading(false);
      });
  };

  const { updateProperty } = createFormHelpers(
    recommendationFormData,
    setRecommendationFormData
  );

  const handleSubmit = () => {
    const loadingToastId = toast.loading("Fetching recommendations...");
    // Submit form data to backend
    fetch("/api/crop/recommendation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recommendationFormData),
    })
      .then(async (response) => {
        toast.dismiss(loadingToastId);
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data);
          setModalOpen(true);
        } else {
          toast.error("An error occurred. Please try again.");
        }
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.");
        console.log(error);
      });
  };

  useEffect(onMount, []);

  return (
    <Page
      title="Crop Recommendation"
      backAction={{ onAction: () => navigate("/") }}
    >
      <Layout sectioned>
        <Layout.Section>
          <Card>
            {loading && <Text as="p">Loading...</Text>}
            {error && (
              <Text as="p">Something went wrong while loading data</Text>
            )}
            {!loading && !error && (
              <Form onSubmit={handleSubmit}>
                <FormLayout>
                  <TextField
                    value={recommendationFormData.name}
                    onChange={(value) => {
                      updateProperty("name", value);
                    }}
                    autoComplete="name"
                    label="Name"
                    placeholder="Enter your name here"
                  ></TextField>
                  <TextField
                    value={recommendationFormData.email}
                    onChange={(value) => {
                      updateProperty("email", value);
                    }}
                    label="Email"
                    autoComplete="email"
                    placeholder="Enter your email here"
                  ></TextField>
                  <Select
                    value={recommendationFormData.crop_id}
                    label="Crop"
                    onChange={(value) => {
                      updateProperty("crop_id", value);
                    }}
                    options={createOptions(formOptions.crop)}
                  ></Select>
                  <Select
                    value={recommendationFormData.most_important_product_id}
                    label="Most Important Product"
                    onChange={(value) => {
                      updateProperty("most_important_product_id", value);
                    }}
                    options={createOptions(formOptions.product)}
                  ></Select>
                  <TextField
                    value={recommendationFormData.min_temp}
                    label="Minimum Temperature (°C)"
                    onChange={(value) =>
                      updateProperty("min_temp", Number(value))
                    }
                    autoComplete="none"
                    type="number"
                  ></TextField>
                  <TextField
                    value={recommendationFormData.max_temp}
                    label="Maximum Temperature (°C)"
                    onChange={(value) =>
                      updateProperty("max_temp", Number(value))
                    }
                    autoComplete="none"
                    type="number"
                  ></TextField>
                  <Select
                    value={recommendationFormData.soil_type_id}
                    label="Soil Type"
                    onChange={(value) => {
                      updateProperty("soil_type_id", value);
                    }}
                    options={createOptions(formOptions.soilType)}
                  ></Select>
                  <Button variant="primary" submit>
                    Get recommendation
                  </Button>
                </FormLayout>
              </Form>
            )}
          </Card>
          <Modal
            title="Recommendation"
            open={modalOpen}
            onClose={() => setModalOpen(false)}
          >
            <Modal.Section>
              {recommendations.length && (
                <>
                  <Text as="p">
                    We found {recommendations.length}
                    {recommendations.length === 1
                      ? " recommendation that suits "
                      : " recommendations that suit "}
                    your needs and listed{" "}
                    {recommendations.length === 1 ? " it " : " them "} below.
                  </Text>
                  <List type="number">
                    {recommendations.map(
                      (recommendation: any, index: number) => (
                        <List.Item key={index}>{recommendation.name}</List.Item>
                      )
                    )}
                  </List>
                  <br />
                  <Text as="p">
                    We have sent the recommendations in more detail to your
                    email ({recommendationFormData.email}). Be sure to check
                    your spam folder if you cannot find the email in your inbox.
                  </Text>
                </>
              )}
              {!recommendations.length && (
                <Text as="p">
                  We couldn't find recommendations found for the given
                  parameters.
                </Text>
              )}
              <br />
              <Button
                variant="secondary"
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                Done
              </Button>
            </Modal.Section>
          </Modal>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
