import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './Components/MainLayout/MainLayout.jsx';
import Rt_cidr from './Components/Rt_cidr/Rt_cidr.jsx';
import Rt_rdns from './Components/Rt_rdns/Rt_rdns.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="cidr" element={<Rt_cidr />} />
          <Route path="rdns" element={<Rt_rdns />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}