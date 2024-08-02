import { Page, Banner } from "@shopify/polaris";

export function LoadingError() {
  return (
    <Page>
      <Banner
        title="Critical Error"
        action={{
          content: "Reload Page",
          onAction: () => {
            window.location.reload();
          },
        }}
        tone="critical"
      >
        There was an error loading critical data from the server. Without this
        data, the system cannot be used. Please reload the page or contact
        support if the problem persists.
      </Banner>
    </Page>
  );
}
