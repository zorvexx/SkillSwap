import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/profile";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import SwapRequests from "./pages/SwapRequests";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />                {/* Home is now default */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/swap-requests" element={<SwapRequests />} />
      </Routes>
    </Router>
  );
}

export default App;