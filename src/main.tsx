import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { DataProvider } from "./DataContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./globals.css";
import Dashboard from "./Dashboard.tsx";
import Class from "./Class.tsx";

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
  <DataProvider>
    <RouterProvider router={BrowserRouter} />
  </DataProvider>
);
