import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AuthProvider } from './context/AuthProvider';
import ErrorBoundary from './components/ErrorBoundary.tsx';

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found!");
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <AppWrapper>
              <App />
            </AppWrapper>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
}
