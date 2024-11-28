import React, { useEffect } from 'react';
import {  Routes, Route, useNavigate } from 'react-router-dom';
import Login from '../components/login';
import SignUp from '../components/signUp';
import DashBord from '../components/dashBord';
import Kudos from '../components/Kudos';
import Analytics from '../components/analytics';

function Routing() {
  const navigate = useNavigate(); 
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token]);

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

export default Routing