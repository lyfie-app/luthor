import { ViteReactSSG } from "vite-react-ssg";
import "./index.css";
import "./App.css";
import { routes } from "./routes";

export const createRoot = ViteReactSSG({
  routes,
  basename: import.meta.env.BASE_URL,
});
