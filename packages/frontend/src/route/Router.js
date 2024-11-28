import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from '../components/login';
import SignUp from '../components/signUp';
import DashBord from '../components/dashBord';
import Kudos from '../components/Kudos';
import Analytics from '../components/analytics';

function Routing() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const publicRoutes = ['/', '/Signup'];
    if (!token && !publicRoutes.includes(location.pathname)) {
      navigate('/');
    }
  }, [token, location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Signup" element={<SignUp />} />
      <Route path="/Dashbord" element={<DashBord />} />
      <Route path="/Kudos" element={<Kudos />} />
      <Route path="/Analytics" element={<Analytics />} />
    </Routes>
  );
}

export default Routing;
