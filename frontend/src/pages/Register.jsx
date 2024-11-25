import React, { useState } from "react";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await fetch("http://localhost:4000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, name })
      });

      setMessage("Registration successful");
      setIsSuccess(true);
    } catch (error) {
      setMessage(error.message || "Registration failed");
      setIsSuccess(false);
    } finally {
      setEmail("");
      setPassword("");
      setName("");
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
          Register
        </Typography>
        <form onSubmit={handleRegister}>
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
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />
          </Box>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Register
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

export default Register;
