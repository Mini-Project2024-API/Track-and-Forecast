import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
// import Announcements from "./pages/Announcements";
// import AlternatePaths from "./pages/AlternatePaths";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/announcements" element={<Announcements />} />
          <Route path="/alternate-paths" element={<AlternatePaths />} /> */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
