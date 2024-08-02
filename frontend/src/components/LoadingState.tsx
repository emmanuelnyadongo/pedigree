import { Page, Spinner, Text } from "@shopify/polaris";

export function LoadingState() {
  return (
    <Page>
      <Spinner size="large" />
      <Text as="p">Loading...</Text>
    </Page>
  );
}
