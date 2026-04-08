import React, { useState } from 'react';
import { TextField, Button, Box, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#1a1a2e',
    borderRadius: '10px',
    fontFamily: "'DM Sans', sans-serif",
    background: '#fafafa',
    '&:hover fieldset': { borderColor: '#922b21' },
    '&.Mui-focused fieldset': { borderColor: '#922b21', borderWidth: 2 },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    fontFamily: "'DM Sans', sans-serif",
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#922b21' },
  '& .MuiInputBase-input': { color: '#1a1a2e' },
};

export default function AuthForm({ isLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', mobileNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const res = await authService.login(formData.email, formData.password);
        if (res?.token) {
          localStorage.setItem('authToken', res.token);
          navigate('/dashboard');
        }
      } else {
        await authService.register(formData.fullName, formData.email, formData.password, formData.mobileNumber);
        const res = await authService.login(formData.email, formData.password);
        if (res?.token) {
          localStorage.setItem('authToken', res.token);
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error && (
        <Alert severity="error" sx={{
          borderRadius: '10px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.88rem',
        }}>
          {error}
        </Alert>
      )}

      {!isLogin && (
        <TextField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          fullWidth
          sx={inputSx}
        />
      )}

      <TextField
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        fullWidth
        sx={inputSx}
      />

      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        fullWidth
        sx={inputSx}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      {!isLogin && (
        <TextField
          label="Mobile Number"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          required
          fullWidth
          sx={inputSx}
        />
      )}

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        sx={{
          mt: 1,
          py: 1.5,
          borderRadius: '10px',
          background: loading ? '#ccc' : 'linear-gradient(135deg, #922b21, #c0392b)',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          fontSize: '1rem',
          textTransform: 'none',
          boxShadow: '0 4px 15px rgba(146,43,33,0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7b241c, #a93226)',
            boxShadow: '0 6px 20px rgba(146,43,33,0.4)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
      </Button>
    </Box>
  );
}