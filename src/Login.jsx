import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  Avatar
} from '@mui/material';
import {
  AccountCircle,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import notificationService from './services/notificationService';
import './App.css';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    const { username, password, confirmPassword } = values;
    
    // Validation
    if (!username) {
      notificationService.validationError('Username', 'Username is required');
      return;
    }
    
    if (!password) {
      notificationService.validationError('Password', 'Password is required');
      return;
    }
    
    if (password.length < 8) {
      notificationService.validationError('Password', 'Password must be at least 8 characters long');
      return;
    }
    
    // Check for password complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasUpperCase) {
      notificationService.validationError('Password', 'Password must contain at least one uppercase letter');
      return;
    }
    
    if (!hasLowerCase) {
      notificationService.validationError('Password', 'Password must contain at least one lowercase letter');
      return;
    }
    
    if (!hasNumbers) {
      notificationService.validationError('Password', 'Password must contain at least one number');
      return;
    }
    
    if (!hasSpecialChar) {
      notificationService.validationError('Password', 'Password must contain at least one special character');
      return;
    }
    
    if (!isLogin && password !== confirmPassword) {
      notificationService.validationError('Confirm Password', 'Passwords do not match');
      return;
    }
    
    if (!isLogin && username.length < 3) {
      notificationService.validationError('Username', 'Username must be at least 3 characters long');
      return;
    }
    
    if (!isLogin && username.length > 20) {
      notificationService.validationError('Username', 'Username must be no more than 20 characters long');
      return;
    }
    
    setLoading(true);
    if (isLogin) {
      await handleLogin(username, password);
    } else {
      await handleSignup(username, password);
    }
    setLoading(false);
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        notificationService.success('Login successful!');
        // Save user session to localStorage
        localStorage.setItem('todoUser', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        if (data && data.message && data.message.includes('locked')) {
          notificationService.error('Account is temporarily locked due to multiple failed login attempts. Please try again later.');
        } else if (data && data.message && data.message.includes('verified')) {
          notificationService.warning('Please verify your account before logging in.');
        } else {
          notificationService.error(data && data.message || 'Login failed. Please check your credentials.');
        }
      }
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        notificationService.error('Unable to connect to the server. Please make sure the backend is running.');
      } else {
        notificationService.error('Network error. Please check your connection and try again.');
      }
    }
  };

  const handleSignup = async (username, password) => {
    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        notificationService.success('Account created successfully! Please check your email to verify your account.');
        setIsLogin(true); // Switch to login view
      } else {
        if (data && data.message && data.message.includes('exists')) {
          notificationService.error('An account with this username already exists. Please choose a different username.');
        } else {
          notificationService.error(data && data.message || 'Signup failed. Please try again.');
        }
      }
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        notificationService.error('Unable to connect to the server. Please make sure the backend is running.');
      } else {
        notificationService.error('Network error. Please check your connection and try again.');
      }
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <div className="app">
      <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
        <Card
          sx={{
            width: '100%',
            boxShadow: 4,
            borderRadius: 3,
            overflow: 'visible',
            position: 'relative',
            mt: 2,
            mb: 2
          }}
        >
          <CardContent sx={{ p: 4, pt: 6 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar sx={{
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                width: 56,
                height: 56
              }}>
                {isLogin ? <LoginIcon /> : <PersonAddIcon />}
              </Avatar>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #2196F3, #21CBF3)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {isLogin ? 'Sign in to manage your todos' : 'Sign up to start managing your todos'}
              </Typography>
            </Box>
            
            <Box component="form" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const values = {
                username: formData.get('username'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword')
              };
              handleSubmit(values);
            }} noValidate role="form" aria-label={isLogin ? "Login form" : "Sign up form"}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel htmlFor="username">Username</InputLabel>
                <OutlinedInput
                  id="username"
                  name="username"
                  type="text"
                  autoFocus
                  startAdornment={
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  }
                  label="Username"
                  required
                  aria-describedby="username-helper-text"
                  sx={{ borderRadius: 2 }}
                />
                <FormHelperText id="username-helper-text">Please enter your username</FormHelperText>
              </FormControl>
              
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  startAdornment={
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        aria-expanded={showPassword}
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  required
                  aria-describedby="password-helper-text"
                  sx={{ borderRadius: 2 }}
                />
                <FormHelperText id="password-helper-text">Please enter your password</FormHelperText>
              </FormControl>
              
              {!isLogin && (
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                  <OutlinedInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    startAdornment={
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          aria-expanded={showConfirmPassword}
                          size="small"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm Password"
                    required
                    aria-describedby="confirm-password-helper-text"
                    sx={{ borderRadius: 2 }}
                  />
                  <FormHelperText id="confirm-password-helper-text">Please confirm your password</FormHelperText>
                </FormControl>
              )}
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  borderRadius: 2,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #03A9F4 90%)',
                    boxShadow: '0 4px 8px 3px rgba(33, 203, 243, .4)',
                  }
                }}
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body1" color="text.primary">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Button
                  variant="text"
                  onClick={toggleForm}
                  sx={{ fontWeight: 700, textTransform: 'none' }}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Button>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

export default Login;