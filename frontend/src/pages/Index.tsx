import { Page, Card, Text, Button, Layout } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

export function Index() {
  const navigate = useNavigate();

  const handleAnimal = () => {
    navigate("/breed-recommendation");
  };

  const handleCrop = () => {
    navigate("/cultivar-recommendation");
  };

  const redirectToSuppliers = () => {
    navigate("/suppliers/login");
  };

  return (
    <Page>
      <Layout sectioned>
        <Layout.Section>
          <Card>
            <Text as="p" variant="bodyLg">
              Which recommendation would you like to receive?
            </Text>
            <br />
            <Button variant="primary" onClick={handleAnimal}>
              For an animal
            </Button>{" "}
            <Button variant="primary" onClick={handleCrop}>
              For a crop
            </Button>{" "}
            <br />
            <br />
            <Button variant="secondary" onClick={redirectToSuppliers}>
              Log in as supplier
            </Button>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
