import { NavLink } from "react-router-dom";
import { appRoutes } from "../routes";
import "./navbar.css";

export default function NavBar() {
  // filter out routes you don't want in the navbar if needed
  const navRoutes = appRoutes.filter((route) => route.label !== "Home");

  return (
    <div
      id="navbar"
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px",
        backgroundColor: "rgba(0,0,0,0.1)",
        borderRadius: "10px",
      }}
    >
      {navRoutes.map(({ path, label }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          {label}
        </NavLink>
      ))}
    </div>
  );
}
