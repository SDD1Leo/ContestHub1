import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import "./index.css"; // ✅ Tailwind CSS import

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ToastContainer
          autoClose={1500}
          theme="dark"
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
