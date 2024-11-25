import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "../features/auth/authSlice";

const Header = () => {
  const token = useSelector((state) => state.auth.token);
  const name = useSelector((state) => state.auth.username);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearCredentials());
    window.location.reload();
  };

  return (
    <Box
      component="header"
      sx={{
        bgcolor: "primary.main",
        color: "white",
        p: 2
      }}>
      <div className="header-content">
        <Typography variant="h6">Trip Explorer</Typography>
        <div className="menu">
          <Link to="/">Home</Link>
          {token ? (
            <>
              <Link>Welcome, {name}!</Link>
              <Link to="/add-trip">Add Trip</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </Box>
  );
};

export default Header;
