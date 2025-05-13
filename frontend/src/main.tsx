import { StrictMode, Suspense } from "react";
import { createRoot } from 'react-dom/client'
import './index.css'
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, useRoutes } from "react-router";
import routes from '~react-pages'
import { Toaster } from "./components/ui/sonner";
import { ModalProvider } from "./providers/modal";

export const App = () => {
  const PageContent = useRoutes(routes);

  return (
    <Suspense fallback={"Loading"}>
      {PageContent}
      <Toaster />
      <ModalProvider />
    </Suspense>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallback={''}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
