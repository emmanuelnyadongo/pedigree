import { createFormHelpers, createOptions } from "../utils";
import { getFormOptions } from "../apiHelpers";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Page,
  Card,
  Select,
  Text,
  Form,
  FormLayout,
  Button,
  TextField,
  Modal,
  List,
  Layout,
} from "@shopify/polaris";

export function BreedRecommendation() {
  const [recommendationFormData, setRecommendationFormData] = useState(
    {} as any
  );
  const [formOptions, setFormOptions] = useState({} as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const navigate = useNavigate();

  const { updateProperty } = createFormHelpers(
    recommendationFormData,
    setRecommendationFormData
  );

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

  const handleSubmit = () => {
    const loadingToastId = toast.loading("Fetching recommendations...");
    // Submit form data to backend
    fetch("/api/animal/recommendation", {
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
        toast.error("Please check your network and try again.");
        console.log(error);
      });
  };

  useEffect(onMount, []);

  return (
    <Page
      title="Animal Recommendation"
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
                    value={recommendationFormData.animal_id}
                    label="Animal"
                    onChange={(value) => {
                      updateProperty("animal_id", value);
                    }}
                    options={createOptions(formOptions.animal)}
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
                    onChange={(value) =>
                      updateProperty("min_temp", Number(value))
                    }
                    value={recommendationFormData.min_temp}
                    autoComplete="none"
                    label="Min Temperature (°C)"
                    type="number"
                  ></TextField>
                  <TextField
                    onChange={(value) =>
                      updateProperty("max_temp", Number(value))
                    }
                    value={recommendationFormData.max_temp}
                    autoComplete="none"
                    label="Max Temperature (°C)"
                    type="number"
                  ></TextField>
                  <br />
                  <Button variant="primary" submit>
                    Get recommendation
                  </Button>
                </FormLayout>
              </Form>
            )}
          </Card>
          <Modal
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
            }}
            title="Recommendations"
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
                    {recommendations.map((recommendation: any) => (
                      <List.Item key={recommendation.id}>
                        {recommendation.name}
                      </List.Item>
                    ))}
                  </List>
                  <Text as="p">
                    We have sent the recommendations in more detail to your
                    email ({recommendationFormData.email})
                  </Text>
                </>
              )}
              {!recommendations.length && (
                <Text as="p">
                  We couldn't find recommendations found for the given
                  parameters. Be sure to check your spam folder if you cannot
                  find the email in your inbox.
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
