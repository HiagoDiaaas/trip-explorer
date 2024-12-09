import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "./pages/Home";
import TripDetails from "./pages/TripDetails";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AddTrip from "./pages/AddTrip";
import EditTrip from "./pages/EditTrip";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState, useEffect } from "react";
import PrivateRoute from "./components/PrivateRoute";
import "./components/Header.css";
import AddGallery from "./pages/AddGallery";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
  }, [token]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/trip/:tripId"
          element={<TripDetails isLoggedIn={isLoggedIn} />}
        />
        <Route
          path="/trip/:tripId/edit"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <EditTrip />
            </PrivateRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/add-trip"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <AddTrip />
            </PrivateRoute>
          }
        />

        <Route
          path="/add-gallery/:tripId"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <AddGallery />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;