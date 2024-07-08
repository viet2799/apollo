import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Person from "./Student";
import Job from "./Job";

const client = new ApolloClient({
  uri: "https://skilled-cardinal-81.hasura.app/v1/graphql",
  cache: new InMemoryCache(),
  connectToDevTools: true,
  headers: {
    "x-hasura-admin-secret":
      "054rq4t1j0Ce1rbzgaV1KHIf8S5mdvkRso6nRD5dwasDFiYpwbpqTDr0oqTEW4x3",
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/person",
    element: <Person />
  },
  {
    path: "/",
    element: <Job />
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>
);
