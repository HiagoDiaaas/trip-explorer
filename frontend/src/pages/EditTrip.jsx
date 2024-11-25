import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  Paper
} from "@mui/material";
import { useParams } from "react-router-dom";

const countries = [
  "Austria",
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

const EditTrip = () => {
  const { tripId } = useParams();
  const [country, setCountry] = useState("");
  const [airport, setAirport] = useState("");
  const [hotel, setHotel] = useState("");
  const [gallery, setGallery] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTrip = async () => {
      const response = await fetch(`http://localhost:4000/trips/${tripId}`);
      const data = await response.json();

      if (response.ok) {
        const trip = data.data;
        setCountry(trip.country);
        setAirport(trip.airport);
        setHotel(trip.hotel);
        setGallery(trip.gallery || []);
      } else {
        setMessage(data.message || "Failed to fetch trip data");
      }
    };

    fetchTrip();
  }, [tripId]);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
  };

  const handleUpdateTrip = async (e) => {
    e.preventDefault();

    const tripData = {
      country,
      airport,
      hotel,
      gallery
    };

    const response = await fetch(`http://localhost:4000/trips/${tripId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tripData)
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Trip updated successfully");
    } else {
      setMessage(data.message || "Failed to update trip");
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

              <Button variant="contained" color="primary" type="submit" fullWidth>
                Update Trip
              </Button>
            </form>
            {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
          </Paper>
        </Box>
      </div>
  );
};

export default EditTrip;
