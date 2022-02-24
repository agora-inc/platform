import React from "react";
import ReactDOM from "react-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Auth0Provider
    domain="mora-stream.eu.auth0.com"
    clientId="Yne7tUF2vVbPQr7ohUUM0MT12MJTrF5l"
    redirectUri={window.location.origin}
    audience="https://mora.stream/api"
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
