import {
  Page,
  Card,
  Text,
  TextField,
  Form,
  FormLayout,
  Button,
  Layout,
} from "@shopify/polaris";
import { useState } from "react";
import toast from "react-hot-toast";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const handleSubmit = () => {
    const loadingToastId = toast.loading("Sending password reset link...");
    fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        frontendUrl: window.location.origin + "/suppliers/reset",
      }),
    }).then((response) => {
      toast.dismiss(loadingToastId);
      if (response.ok) {
        toast.success("Password reset link sent to your email");
      } else {
        toast.error(response.statusText);
      }
    });
  };
  return (
    <Page narrowWidth>
      <Layout sectioned>
        <Layout.Section>
          <Card>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <Text as="h1" variant="headingSm">
                  Forgot Password
                </Text>
                <TextField
                  label="Email"
                  value={email}
                  onChange={(value) => {
                    setEmail(value);
                  }}
                  autoComplete="email"
                ></TextField>
                <Button submit variant="primary">
                  Reset Password
                </Button>
              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
