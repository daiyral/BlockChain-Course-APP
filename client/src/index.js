import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createRoot } from 'react-dom/client';
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
const root = createRoot(document.getElementById("root"));
root.render(<FluentProvider theme={teamsLightTheme}><App /> </FluentProvider>);