import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, CircularProgress, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, signUpUser } from '../../app/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  const handleSubmit = () => {
    if (isSignUp) {
        if (password !== confirmPassword) {
            // Handle password mismatch
            return;
        }
        dispatch(signUpUser({ name, email, password, roles: "admin" }))
            .unwrap()
            .then(() => {
              console.log("pppppppppp")
              setIsSignUp(false)
                // Redirect to login page after successful sign-up
                navigate('/login');
            })
            .catch((error) => {
                // Handle sign-up error if needed
                console.error("Sign-up error:", error);
            });
    } else {
        dispatch(loginUser({ email, password }));
    }
};


  useEffect(() => {
    if (isAuthenticated) {
      if (user === 'admin') {
        navigate('/adminPanel');
      } else {
        navigate('/login');
          setIsSignUp(false) // or wherever you want to navigate for non-admin users
      }
    }
  }, [isAuthenticated, user, navigate]);

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f4f9',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '900px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#fff',
        }}
      >
        <Box
          sx={{
            width: '50%',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            transition: 'transform 0.5s ease-in-out',
            transform: isSignUp ? 'translateX(100%)' : 'translateX(0)',
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            {isSignUp ? 'Sign Up' : 'Login'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#777', mb: 3 }}>
            {isSignUp
              ? 'Join us today! Fill in the details to create an account.'
              : 'Enter your credentials to login and start your session.'}
          </Typography>

          {isSignUp && (
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              sx={{ mb: 2 }}
            />
          )}
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            sx={{ mb: 2 }}
          />

          {isSignUp && (
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              sx={{ mb: 2 }}
            />
          )}

          {!isSignUp && (
            <Typography
              variant="body2"
              sx={{ cursor: 'pointer', color: '#0066cc', textDecoration: 'underline', marginTop: '8px' }}
              onClick={() => navigate('/forgotPassword')}
            >
              Forgot Password?
            </Typography>
          )}

          {error && <Typography color="error">{error}</Typography>}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            fullWidth
            sx={{ mt: 2, py: 1.5, backgroundColor: '#6a5acd', borderRadius: '8px' }}
          >
            {loading ? <CircularProgress size={24} /> : isSignUp ? 'Sign Up' : 'Login Now'}
          </Button>

          <Divider sx={{ my: 3 }} />
          <Typography
            variant="body2"
            sx={{ cursor: 'pointer', color: '#0066cc', marginTop: '16px' }}
            onClick={toggleForm}
          >
            {isSignUp ? 'Already have an account? Login' : 'Need an Account? Sign Up'}
          </Typography>
        </Box>

        <Box
          sx={{
            width: '50%',
            backgroundColor: '#e8f0ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px',
            position: 'relative',
            transition: 'transform 0.5s ease-in-out',
            transform: isSignUp ? 'translateX(-100%)' : 'translateX(0)',
          }}
        >
          <img
            src="/path-to-your-image.jpg" // Replace with your image path
            alt="Login illustration"
            style={{
              maxWidth: '100%',
              borderRadius: '16px',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
