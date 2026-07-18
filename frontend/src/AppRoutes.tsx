import { Routes, Route } from "react-router-dom";
import { appRoutes } from "./routes";

export function AppRoutes() {
  return (
    <Routes>
      {appRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>
  );
}
