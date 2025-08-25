import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Stack,
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

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password || (!isLogin && !confirmPassword)) {
      notificationService.error('Please fill in all fields.');
      return;
    }
    
    if (!isLogin && password !== confirmPassword) {
      notificationService.error('Passwords do not match.');
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        notificationService.success('Login successful!');
        localStorage.setItem('todoUser', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        notificationService.error(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      notificationService.error('Network error. Please try again.');
    }
  };

  const handleSignup = async (username, password) => {
    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        notificationService.success('Signup successful! Please log in.');
        setIsLogin(true);
      } else {
        notificationService.error(data.message || 'Signup failed.');
      }
    } catch (error) {
      notificationService.error('Network error. Please try again.');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Card
        sx={{
          p: 4,
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
          {isLogin ? <LoginIcon /> : <PersonAddIcon />}
        </Avatar>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {isLogin ? 'Sign in to continue' : 'Create an account to get started'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
          <Stack spacing={2}>
            <TextField
              id="username"
              name="username"
              label="Username"
              autoComplete="username"
              autoFocus
              required
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                startAdornment={<InputAdornment position="start"><Lock /></InputAdornment>}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            {!isLogin && (
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                <OutlinedInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  startAdornment={<InputAdornment position="start"><Lock /></InputAdornment>}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </Stack>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="text"
            onClick={toggleForm}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </Button>
        </Box>
      </Card>
    </Container>
  );
}

export default Login;