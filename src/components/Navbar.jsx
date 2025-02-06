import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home'; // Placeholder icon
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <AppBar position="static" color="primary" component={motion.nav} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Toolbar>
        {/* Logo and App Name */}
        <Box display="flex" alignItems="center" flexGrow={1}>
          <IconButton edge="start" color="inherit" aria-label="logo">
            <img
              src="src/assets/habit-tracker-app-icon.jpg" // Replace with your actual image path
              alt="Habit Tracker Logo"
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: 'inherit', marginLeft: 1 }}
            as={motion.span}
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Habit Tracker
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box display="flex" gap={2}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button color="inherit" component={Link} to="/signup">
              Signup
            </Button>
          </motion.div>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;