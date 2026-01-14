import { NavLink } from 'react-router-dom';
import S from './Style.module.css';

export default function Navbar() {
  return (
    <div className={S.Navbar}>
      <div className={S.Logo}><span>🌐</span> NetToolBox</div>
      <nav className={S.NavLinks}>
        <div className={S.NavGroup}>
          <div className={S.NavLabel}>IP Tools</div>
          <NavLink to="/cidr" className={({ isActive }) => isActive ? S.Active : undefined}>IP CIDR Calculator</NavLink>
          <NavLink to="/rdns" className={({ isActive }) => isActive ? S.Active : undefined}>rDNS Generator</NavLink>
        </div>
      </nav>
    </div>
  );
}