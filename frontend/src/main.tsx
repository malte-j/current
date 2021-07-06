import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "https://81b4e7d62aa240298ef32455486c4de7@o912313.ingest.sentry.io/5849233",
  // integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)