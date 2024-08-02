import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Page,
  Form,
  FormLayout,
  TextField,
  Button,
  Card,
  Text,
  ButtonGroup,
  Layout,
} from "@shopify/polaris";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = useCallback((value: string) => setEmail(value), []);
  const handlePasswordChange = useCallback(
    (value: string) => setPassword(value),
    []
  );
  const handleSubmit = async () => {
    // Submit email and password to backend
    const loadingToastId = toast.loading("Logging in...");
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    toast.dismiss(loadingToastId);
    if (response.ok) {
      toast.success("Logged in successfully");
      const { token } = await response.json();
      const SESSION_DURATION = 3 * 60 * 60 * 1000 - 30_000;

      // Set a logout timeout
      setTimeout(() => {
        window.localStorage.removeItem("token");
        navigate("/suppliers/login");
      }, SESSION_DURATION);

      // Store token in local storage
      window.localStorage.setItem("token", token);

      // Redirect to dashboard page
      navigate("/suppliers/");
    } else {
      // Show error message
      toast("Invalid email or password");
    }
  };

  return (
    <Page narrowWidth>
      <Layout sectioned>
        <Layout.Section>
          <Card>
            <Text as="h1" variant="headingLg">
              Login
            </Text>
            <br />
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  value={email}
                  label="Email"
                  type="email"
                  autoComplete="email"
                  onChange={handleEmailChange}
                />
                <TextField
                  value={password}
                  label="Password"
                  type="password"
                  autoComplete="password"
                  onChange={handlePasswordChange}
                />
                <ButtonGroup>
                  <Button submit variant="primary">
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/suppliers/forgot");
                    }}
                  >
                    Forgot Password
                  </Button>
                </ButtonGroup>
              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
