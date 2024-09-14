import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    // Add logic to handle password reset
    console.log('Password reset for:', email);
  };

  return (
    <Box sx={{ width: 300, margin: '0 auto', textAlign: 'center', padding: 3 }}>
      <Typography variant="h5">Forgot Password</Typography>
      <Typography variant="body2" sx={{ marginBottom: 2 }}>
        Enter your email to reset your password
      </Typography>
      <TextField
        fullWidth
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleForgotPassword}
        fullWidth
        sx={{ mt: 2 }}
      >
        Send Reset Link
      </Button>
    </Box>
  );
};

export default ForgotPassword;
