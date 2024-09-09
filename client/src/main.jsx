import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <Toaster
      toastOptions={{
        classNames: {
          error: "bg-red-400",
          success: "bg-green-500",
          warning: "bg-yellow-500",
          info: "bg-blue-400",
        },
      }}
    />
  </StrictMode>
);
