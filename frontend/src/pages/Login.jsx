import React, { useState } from "react";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setCredentials } from "../features/auth/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Login successful");
        setIsSuccess(true);

        dispatch(setCredentials({ 
          token: data.token, 
          username: data.email,
          userId: data.userId 
        }));

        navigate("/");
      } else {
        setMessage(data.message || "Login failed");
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("Wrong username or password");
      setIsSuccess(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh"
      }}
      className="container">
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 600 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <Box sx={{ mb: 2 }}>
            <TextField
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
          </Box>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Login
          </Button>
        </form>
        {message && (
          <Typography
            sx={{ mt: 2 }}
            color={isSuccess ? "success.main" : "error.main"}>
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Login;