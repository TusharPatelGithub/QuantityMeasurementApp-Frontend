import React, { useState } from 'react';
import { Box, Typography, Button, AppBar, Toolbar, Container } from '@mui/material';
import { ScaleOutlined, LogoutOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Converter from '../components/Converter';

const types = ['length', 'volume', 'weight', 'temperature'];

const typeIcons = {
  length: '📏',
  volume: '🧪',
  weight: '⚖️',
  temperature: '🌡️',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState('length');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: '10px',
              background: 'linear-gradient(135deg, #922b21, #c0392b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ScaleOutlined sx={{ fontSize: 20, color: '#fff' }} />
            </Box>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#1a1a2e',
            }}>
              Quantity Measurement
            </Typography>
          </Box>

          <Button
            onClick={handleLogout}
            startIcon={<LogoutOutlined />}
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              color: '#922b21',
              textTransform: 'none',
              border: '1.5px solid #922b21',
              borderRadius: '10px',
              px: 2.5,
              '&:hover': {
                background: '#fdf2f1',
              }
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ pt: 5, pb: 8 }}>
        {/* Page Title */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: { xs: '1.8rem', sm: '2.4rem' },
            fontWeight: 700,
            color: '#1a1a2e',
            mb: 1,
          }}>
            Unit Converter
          </Typography>
          <Typography sx={{ color: '#6b7280', fontSize: '1rem' }}>
            Select a measurement type and convert between units instantly
          </Typography>
        </Box>

        {/* Type Selector */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          mb: 5,
          flexWrap: 'wrap',
        }}>
          {types.map(type => (
            <Button
              key={type}
              onClick={() => setActiveType(type)}
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: '0.92rem',
                textTransform: 'capitalize',
                px: 3, py: 1.2,
                borderRadius: '50px',
                border: activeType === type ? 'none' : '1.5px solid #e5e7eb',
                background: activeType === type
                  ? 'linear-gradient(135deg, #922b21, #c0392b)'
                  : '#fff',
                color: activeType === type ? '#fff' : '#4b5563',
                boxShadow: activeType === type
                  ? '0 4px 15px rgba(146,43,33,0.3)'
                  : '0 1px 3px rgba(0,0,0,0.06)',
                '&:hover': {
                  background: activeType === type
                    ? 'linear-gradient(135deg, #7b241c, #a93226)'
                    : '#fdf2f1',
                  borderColor: '#922b21',
                  color: activeType === type ? '#fff' : '#922b21',
                },
                transition: 'all 0.2s ease',
                gap: 1,
              }}
            >
              <span>{typeIcons[type]}</span> {type}
            </Button>
          ))}
        </Box>

        {/* Converter */}
        <Converter type={activeType} />
      </Container>
    </Box>
  );
}