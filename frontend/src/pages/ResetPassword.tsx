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
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export function ResetPassword() {
  const [searchParams, _setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = searchParams.get("token");

  const handleSubmit = () => {
    const loadingToastId = toast.loading("Resetting password...");
    if (password === confirmPassword) {
      fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, token }),
      }).then((response) => {
        toast.dismiss(loadingToastId);
        if (response.ok) {
          toast.success("Password reset successfully. Please login.");
          navigate("/suppliers/login");
        } else {
          toast.error("An error occurred. Please try again.");
        }
      });
    } else {
      toast.error("Your passwords do not match.");
    }
  };

  return (
    <Page narrowWidth>
      <Layout sectioned>
        <Layout.Section>
          <Card>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <Text as="h1" variant="headingSm">
                  Reset Password
                </Text>
                <TextField
                  label="New Password"
                  type="password"
                  onChange={(value) => {
                    setPassword(value);
                  }}
                  value={password}
                  autoComplete="password"
                ></TextField>
                <TextField
                  type="password"
                  label="Confirm Password"
                  onChange={(value) => {
                    setConfirmPassword(value);
                  }}
                  value={confirmPassword}
                  autoComplete="password"
                ></TextField>
                <Button variant="primary" submit>
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
