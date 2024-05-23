import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { DataProvider } from "./DataContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./globals.css";
import Dashboard from "./Dashboard.tsx";
import Class from "./Class.tsx";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/class/:index",
    element: <Class />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <DataProvider>
      <RouterProvider router={BrowserRouter} />
    </DataProvider>
  </ThemeProvider>
);
