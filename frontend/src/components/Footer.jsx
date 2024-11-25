import React from "react";
import { Box, Typography } from "@mui/material";
import "./Footer.css";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",
        color: "white",
        py: 2,
        textAlign: "center",
        mt: 4
      }}>
      <Typography variant="body2">
        © 2024 Trip Explorer. All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
