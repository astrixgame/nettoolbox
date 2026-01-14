import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar.jsx";
import S from "./Style.module.css";

export default function MainLayout() {
  return (
    <div className={S.MainLayout}>
      <div className={S.NavbarWrapper}>
        <Navbar />
      </div>
      <div className={S.ContentWrapper}>
        <Outlet />
      </div>
    </div>
  );
}