import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch all trips
export const fetchTrips = createAsyncThunk(
  "trips/fetchTrips",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4000/api/v1/trips");
      if (!response.ok) {
        throw new Error("Failed to fetch trips");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const tripsSlice = createSlice({
  name: "trips",
  initialState: {
    trips: [],
    selectedTrip: null,
    error: null
  },
  reducers: {
    findTripById: (state, action) => {
      const tripId = action.payload;
      const foundTrip = state.trips.find((trip) => trip.id === tripId);
      state.selectedTrip = foundTrip || null;
    },
    removeTrip: (state, action) => {
      const tripId = action.payload;
      state.trips = state.trips.filter((trip) => trip.id !== tripId);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.trips = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { findTripById, removeTrip } = tripsSlice.actions;

export default tripsSlice.reducer;
