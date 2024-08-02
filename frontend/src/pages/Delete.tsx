import { Page, Card, Button, Text, Layout } from "@shopify/polaris";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "react-redux";
import { authenticatedFetch } from "../apiHelpers";
import toast from "react-hot-toast";

export function Delete() {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const store = useStore();

  // @ts-ignore
  const item = store.getState()[type].find((resource) => resource.id === id);

  const onConfirmDelete = () => {
    const loadingToastId = toast.loading(`Deleting ${item.name}...`);
    authenticatedFetch(`/api/${type}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((response) => {
        if (response.ok) {
          toast.dismiss(loadingToastId);
          toast.success(`${item.name} deleted successfully.`);
          navigate("/suppliers/");
        } else {
          toast.error("An error occurred. Please try again.");
        }
      })
      .catch((error) => {
        toast.error("Check your network and try again.");
        console.log(error);
      });
  };

  const onCancel = () => {
    navigate(-1);
  };

  return (
    <Page>
      <Layout sectioned>
        <Layout.Section>
          <Card>
            <Text as="h1" variant="headingMd">
              Confirm Delete
            </Text>
            <br />
            <Text as="p">Are you sure you want to delete {item.name}?</Text>
            <br />
            <Button variant="primary" onClick={onConfirmDelete}>
              Delete
            </Button>{" "}
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
