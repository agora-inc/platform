import React from "react";
import ReactDOM from "react-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Auth0Provider
    domain="jikji.eu.auth0.com"
    clientId="bjCm1jlXaTpPuf7WefkzJy88qrDQrNg9"
    redirectUri={window.location.origin}
    audience="https://jikji.club/api"
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
