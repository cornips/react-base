import React from "react";
import config from "../config";
import { validateConfig, i18n } from "../helpers";

import { AppContainer, AppHeader, AppLogo, AppLink } from "./App.style";
import logo from "../assets/logo.svg";

function App() {
  // Validate config file
  validateConfig("link.href");

  return (
    <AppContainer>
      <AppHeader>
        <AppLogo src={logo} alt="logo" />
        <p
          dangerouslySetInnerHTML={{
            __html: i18n("Edit <code>src/App.js</code> and save to reload.")
          }}
        />
        <AppLink
          href={config.link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {i18n("Learn React")}
        </AppLink>
      </AppHeader>
    </AppContainer>
  );
}

export default App;
