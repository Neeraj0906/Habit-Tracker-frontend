import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Button, Box } from '@mui/material'; // Import Box and Button
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Define light and dark themes
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2', // Blue color for buttons and accents
      },
      secondary: {
        main: '#4caf50', // Green color for success states
      },
      background: {
        default: darkMode ? '#121212' : '#ffffff', // Dark or light background
        paper: darkMode ? '#1e1e1e' : '#fafafa', // Card and surface colors
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline ensures consistent styling across browsers */}
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Navbar />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setDarkMode(!darkMode)}
              sx={{ mb: 2 }}
            >
              Toggle {darkMode ? 'Light' : 'Dark'} Mode
            </Button>
          </Box>
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Login />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;