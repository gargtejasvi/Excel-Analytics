import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import "./App.css";
import FileUpload from "./components/FileUpload";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} /> //dashboard or homepage
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <h1>Dashboard</h1> : <Navigate to="/login" />
            }
          />
        </Routes>
      </Router>
      {/* <FileUpload /> */}
    </div>
  );
}

export default App;
