import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Paper } from '@mui/material';
import { ScaleOutlined } from '@mui/icons-material';
import AuthForm from '../components/AuthForm';

export default function AuthPage() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      background: '#f8f9fa',
    }}>
      {/* Left Illustration Panel */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #922b21 0%, #c0392b 60%, #e74c3c 100%)',
        color: '#fff',
        px: 6,
        py: 8,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <Box sx={{ position: 'absolute', bottom: -60, right: -60, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <Box sx={{ position: 'absolute', top: '40%', right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Icon */}
          <Box sx={{
            width: 90, height: 90, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 4,
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.2)',
          }}>
            <ScaleOutlined sx={{ fontSize: 44, color: '#fff' }} />
          </Box>

          <Typography sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.6rem',
            fontWeight: 700,
            lineHeight: 1.2,
            mb: 2,
          }}>
            Quantity<br />Measurement
          </Typography>

          <Typography sx={{ fontSize: '1.05rem', opacity: 0.85, maxWidth: 320, mx: 'auto', lineHeight: 1.7 }}>
            Convert lengths, weights, volumes, and temperatures with precision and ease.
          </Typography>

          {/* Feature pills */}
          {['Length & Distance', 'Weight & Mass', 'Volume & Capacity', 'Temperature'].map((f) => (
            <Box key={f} sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 99, px: 2.5, py: 0.8,
              mt: 1.5, mr: 1,
              fontSize: '0.82rem',
              backdropFilter: 'blur(4px)',
            }}>
              ✓ {f}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right Form Panel */}
      <Box sx={{
        flex: { xs: 1, md: 'none' },
        width: { md: '480px' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 3, sm: 6 },
        py: 6,
        background: '#fff',
        boxShadow: '-4px 0 40px rgba(0,0,0,0.06)',
      }}>
        {/* Logo for mobile */}
        <Box sx={{ display: { md: 'none' }, mb: 3, textAlign: 'center' }}>
          <ScaleOutlined sx={{ fontSize: 36, color: '#922b21' }} />
          <Typography variant="h5" fontWeight={700} color="#922b21">Quantity Measurement</Typography>
        </Box>

        <Box sx={{ width: '100%', maxWidth: 380 }}>
          <Typography sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2rem',
            fontWeight: 700,
            color: '#1a1a2e',
            mb: 0.5,
          }}>
            Welcome back
          </Typography>
          <Typography sx={{ color: '#6b7280', mb: 3, fontSize: '0.95rem' }}>
            {tabIndex === 0 ? 'Sign in to your account' : 'Create a new account'}
          </Typography>

          {/* Tabs */}
          <Tabs
            value={tabIndex}
            onChange={(_, v) => setTabIndex(v)}
            variant="fullWidth"
            sx={{
              mb: 3,
              borderBottom: '2px solid #f0f0f0',
              '& .MuiTab-root': {
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: '0.95rem',
                color: '#9ca3af',
                textTransform: 'none',
                pb: 1.5,
              },
              '& .Mui-selected': { color: '#922b21 !important' },
              '& .MuiTabs-indicator': { backgroundColor: '#922b21', height: 3, borderRadius: 99 },
            }}
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          <AuthForm isLogin={tabIndex === 0} />
        </Box>
      </Box>
    </Box>
  );
}