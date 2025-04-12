import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

//Import i18n.ts
import "./i18n";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(<App />);
