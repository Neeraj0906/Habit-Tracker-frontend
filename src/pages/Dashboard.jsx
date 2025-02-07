import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Box,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Confetti from "react-confetti"; // Import Confetti
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"; // Import Recharts components

const Dashboard = () => {
  const { token, logout } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newHabit, setNewHabit] = useState({ name: "", description: "" });
  const [points, setPoints] = useState(0); // Points state
  const [badges, setBadges] = useState([]); // Badges state
  const [showConfetti, setShowConfetti] = useState(false); // State for confetti
  const [chartData, setChartData] = useState([]); // State for chart data

  useEffect(() => {
    if (!token) return;

    const fetchHabitsAndData = async () => {
      try {
        const habitsResponse = await axios.get(
          "https://habit-tracker-backend-b8nl.onrender.com/api/habits",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHabits(habitsResponse.data);

        const userResponse = await axios.get(
          "https://habit-tracker-backend-b8nl.onrender.com/api/auth/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPoints(userResponse.data.points);
        setBadges(userResponse.data.badges);

        // Simulate fetching chart data (replace with actual API call if needed)
        const mockChartData = [
          { name: "Mon", completions: 3 },
          { name: "Tue", completions: 5 },
          { name: "Wed", completions: 4 },
          { name: "Thu", completions: 6 },
          { name: "Fri", completions: 7 },
          { name: "Sat", completions: 2 },
          { name: "Sun", completions: 8 },
        ];
        setChartData(mockChartData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };

    fetchHabitsAndData();
  }, [token]);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://habit-tracker-backend-b8nl.onrender.com/api/habits",
        newHabit,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHabits([...habits, response.data]);
      setNewHabit({ name: "", description: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add habit.");
    }
  };

  const handleCompleteHabit = async (habitId) => {
    try {
      const response = await axios.put(
        `https://habit-tracker-backend-b8nl.onrender.com/api/habits/${habitId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit._id === habitId ? response.data.habit : habit
        )
      );

      setPoints(response.data.points);
      setBadges(response.data.badges);

      // Trigger confetti animation
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000); // Hide after 3 seconds

      toast.success(
        `Habit marked as completed! Points: ${response.data.points}`
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark habit as completed.");
    }
  };

  if (!token) {
    return null; // Redirect handled by AuthProvider
  }

  if (loading) {
    return (
      <Typography variant="body1" align="center" sx={{ mt: 4 }}>
        Loading habits...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="body1" align="center" color="error" sx={{ mt: 4 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Confetti Animation */}
      {showConfetti && <Confetti />}

      {/* Toast container */}
      <ToastContainer />

      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        sx={{
          backgroundColor: "#f0f8ff",
          p: 2, // Reduced padding for smaller screens
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary">
          Your Habits
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6" color="success.main">
            Points: {points}
          </Typography>
          <Button variant="contained" color="error" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Box>

      {/* Badges Section */}
      <Box mb={4}>
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          color="secondary"
        >
          Badges
        </Typography>
        {badges.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No badges yet. Keep going!
          </Typography>
        ) : (
          <Box display="flex" flexWrap="wrap" gap={1}>
            {badges.map((badge, index) => (
              <Chip
                key={index}
                label={badge}
                color="primary"
                variant="outlined"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Responsive font size
                  backgroundColor: "#e3f2fd",
                  borderColor: "#1976d2",
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Add Habit Form */}
      <Card sx={{ mb: 4, p: { xs: 2, sm: 3 }, backgroundColor: "#fff3e0" }}>
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            Add a New Habit
          </Typography>
          <form onSubmit={handleAddHabit}>
            <TextField
              fullWidth
              label="Habit Name"
              value={newHabit.name}
              onChange={(e) =>
                setNewHabit({ ...newHabit, name: e.target.value })
              }
              margin="normal"
              sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={newHabit.description}
              onChange={(e) =>
                setNewHabit({ ...newHabit, description: e.target.value })
              }
              margin="normal"
              multiline
              rows={3}
              sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Add Habit
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Display Habits */}
      <Grid container spacing={3}>
        {habits.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            No habits found. Add a new habit!
          </Typography>
        ) : (
          habits.map((habit, index) => (
            <Grid item xs={12} sm={6} md={4} key={habit._id}>
              {" "}
              {/* Responsive grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }} // Staggered animation
              >
                <Card
                  sx={{
                    p: { xs: 2, sm: 3 }, // Responsive padding
                    backgroundColor: "#e3f2fd",
                    borderRadius: 2,
                    boxShadow: 3,
                    position: "relative",
                  }}
                >
                  <CardContent>
                    {/* Habit Name */}
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="primary"
                      gutterBottom
                      sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} // Responsive font size
                    >
                      {habit.name}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 2, fontSize: { xs: "0.875rem", sm: "1rem" } }} // Responsive font size
                    >
                      {habit.description}
                    </Typography>

                    {/* Streak */}
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle1"
                        color="secondary"
                        sx={{
                          fontWeight: "bold",
                          mb: 1,
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                        }} // Responsive font size
                      >
                        Streak:{" "}
                        <span style={{ color: "#d32f2f" }}>{habit.streak}</span>
                      </Typography>

                      {/* Progress Bar */}
                      <LinearProgress
                        variant="determinate"
                        value={(habit.streak % 7) * (100 / 7)} // Example: Progress toward a 7-day streak
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#4caf50", // Green progress color
                          },
                        }}
                      />
                    </Box>

                    {/* Mark as Completed Button */}
                    <motion.div
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: 16,
                        transform: "translateY(-50%)",
                        textAlign: "center",
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconButton
                        onClick={() => handleCompleteHabit(habit._id)}
                        sx={{
                          backgroundColor: "#4caf50",
                          color: "#ffffff",
                          "&:hover": { backgroundColor: "#388e3c" },
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </IconButton>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          mt: 1,
                          display: "block",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }} // Responsive font size
                      >
                        Mark as Completed
                      </Typography>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))
        )}
      </Grid>

      <Box mt={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
          Habit Completion Trends
        </Typography>
        <Card
          sx={{
            p: 3,
            backgroundColor: "#e3f2fd",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              {/* Background Grid */}
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />

              {/* X-Axis (Days) */}
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#616161" }}
                axisLine={{ stroke: "#bdbdbd" }}
              />

              {/* Y-Axis (Completions) */}
              <YAxis
                tick={{ fontSize: 12, fill: "#616161" }}
                axisLine={{ stroke: "#bdbdbd" }}
              />

              {/* Tooltip */}
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  borderRadius: 4,
                  padding: "8px",
                }}
                labelStyle={{ fontWeight: "bold", color: "#424242" }}
                itemStyle={{ color: "#4caf50" }}
              />

              {/* Legend */}
              <Legend
                wrapperStyle={{
                  paddingTop: "10px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#424242",
                }}
              />

              {/* Bar Chart */}
              <Bar
                dataKey="completions"
                fill="#4caf50"
                radius={[4, 4, 0, 0]} // Rounded corners for bars
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Box>
    </Container>
  );
};

export default Dashboard;
