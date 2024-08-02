import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import enTranslations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import { AppProvider } from "@shopify/polaris";
import { Provider } from "react-redux";
import { store } from "./stores.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppProvider i18n={enTranslations}>
    <Provider store={store}>
      <App />
    </Provider>
  </AppProvider>
);
