import { MetaMaskProvider } from "@metamask/sdk-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: "Example React Dapp",
          url: window.location.href,
        },
        infuraAPIKey: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        // Other options.
      }}
    >
      <App />
    </MetaMaskProvider>
  </StrictMode>
);
