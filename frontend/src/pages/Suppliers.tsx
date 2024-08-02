import { Page, Card, Text, Layout } from "@shopify/polaris";
import { ExitIcon } from "@shopify/polaris-icons";
import { useEffect, useState } from "react";
import { useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BreedsList, CultivarsList } from "../components";
import toast from "react-hot-toast";

export function Suppliers() {
  const store = useStore();
  const navigate = useNavigate();
  const [_loading, setLoading] = useState(true);
  const [_error, setError] = useState(false);

  // @ts-ignore
  const formOptions = store.getState().formOptions;
  const token = window.localStorage.getItem("token");

  const onMount = () => {
    // Redirect to login if token is missing
    if (!token) {
      navigate("/suppliers/login");
    } else {
      // Fetch options if they do not already exist
      if (!formOptions)
        fetch("/api/form-options")
          .then(async (response) => {
            const formOptions = await response.json();
            store.dispatch({ type: "SET_FORM_OPTIONS", formOptions });
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setError(true);
            setLoading(false);
          });
    }
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    toast.success("Logged out successfully.");
    navigate("/suppliers/login");
  };

  useEffect(onMount, []);

  if (!token) return <Text as="p">Redirecting you to login...</Text>;
  else
    return (
      <Page
        title="Dashboard"
        secondaryActions={[
          { content: "Logout", onAction: logout, icon: ExitIcon },
        ]}
        actionGroups={[
          {
            title: "Create new",
            actions: [
              {
                content: "Create new breed",
                onAction: () => navigate("/suppliers/edit-breed/new"),
              },
              {
                content: "Create new cultivar",
                onAction: () => navigate("/suppliers/edit-cultivar/new"),
              },
            ],
          },
        ]}
      >
        <Layout>
          <Layout.Section>
            <Card>
              <BreedsList />
              <br />
              <CultivarsList />
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
}
