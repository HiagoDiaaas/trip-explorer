import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  Paper
} from "@mui/material";
import { useSelector } from "react-redux";

const countries = [
  "Austria",
  "Brazil",
  "Belgium",
  "Czech Republic",
  "Denmark",
  "Luxembourg",
  "Netherlands",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Russia",
  "Spain",
  "Sweden",
  "Switzerland",
  "United Kingdom"
];

const AddTrip = () => {
  const [country, setCountry] = useState("");
  const [airport, setAirport] = useState("");
  const [hotel, setHotel] = useState("");
  const [galleryImages, setGalleryImages] = useState("");
  const [message, setMessage] = useState("");

  const token = useSelector((state) => state.auth.token);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
  };

  const handleAddTrip = async (e) => {
    e.preventDefault();

    const galleryImageUrls = galleryImages
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url);

    const tripData = {
      country,
      airport,
      hotel,
      galleryImages: galleryImageUrls
    };

    try {
      const response = await fetch("http://localhost:4000/api/v1/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(tripData)
      });

      if (response.ok) {
        setMessage("Trip added successfully");
        setCountry("");
        setAirport("");
        setHotel("");
        setGalleryImages("");
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to add trip");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setMessage("Network error: Failed to add trip");
    }
  };

  return (
    <div className="container">
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 600 }}>
          <Typography variant="h5" gutterBottom>
            Add New Trip
          </Typography>
          <form onSubmit={handleAddTrip}>
            <Box sx={{ mb: 2 }}>
              <Select
                value={country}
                onChange={handleCountryChange}
                displayEmpty
                fullWidth
                required>
                <MenuItem value="">Select a country</MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                label="Airport"
                value={airport}
                onChange={(e) => setAirport(e.target.value)}
                fullWidth
                required
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                label="Hotel"
                value={hotel}
                onChange={(e) => setHotel(e.target.value)}
                fullWidth
                required
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Gallery Images (URLs separated by commas)"
                value={galleryImages}
                onChange={(e) => setGalleryImages(e.target.value)}
                fullWidth
              />
            </Box>

            <Button variant="contained" color="primary" type="submit" fullWidth>
              Add Trip
            </Button>
          </form>
          {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
        </Paper>
      </Box>
    </div>
  );
};

export default AddTrip;
