import {createRoot} from "react-dom/client";
import App from "./components/App";

const rootElement = document.getElementById("root");
const reactRoot = createRoot(rootElement!);

reactRoot.render(
    <App />
);