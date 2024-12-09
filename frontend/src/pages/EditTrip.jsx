import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Select, MenuItem, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
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
  "United Kingdom",
];

const EditTrip = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const [country, setCountry] = useState("");
  const [airport, setAirport] = useState("");
  const [hotel, setHotel] = useState("");
  const [galleryImages, setGalleryImages] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/v1/trips/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setCountry(data.country);
          setAirport(data.airport);
          setHotel(data.hotel);
          setGalleryImages(data.galleryImages.join(", "));
        } else {
          console.error("Failed to fetch trip details.");
        }
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    fetchTrip();
  }, [tripId, token]);

  const handleUpdateTrip = async (e) => {
    e.preventDefault();

    const galleryImageUrls = galleryImages
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url);

    const tripData = { country, airport, hotel, galleryImages: galleryImageUrls };

    try {
      const response = await fetch(`http://localhost:4000/api/v1/trips/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tripData),
      });

      if (response.ok) {
        setMessage("Trip updated successfully.");
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to update trip.");
      }
    } catch (error) {
      console.error("Error updating trip:", error);
      setMessage("Network error: Failed to update trip.");
    }
  };

  return (
    <div className="container">
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 600 }}>
          <Typography variant="h5" gutterBottom>
            Edit Trip
          </Typography>
          <form onSubmit={handleUpdateTrip}>
            <Box sx={{ mb: 2 }}>
              <Select value={country} onChange={(e) => setCountry(e.target.value)} fullWidth required>
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
              Update Trip
            </Button>
          </form>
          {message && (
            <Typography sx={{ mt: 2, color: "green", textAlign: "center" }}>
              {message}
            </Typography>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default EditTrip;