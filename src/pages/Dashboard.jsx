import React, { useState } from 'react';
import { Box, Typography, Button, AppBar, Toolbar, Container } from '@mui/material';
import { ScaleOutlined, LogoutOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Converter from '../components/Converter';
import History from '../components/History';

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
  const [activeOperation, setActiveOperation] = useState('CONVERT');

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
          mb: 4,
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

        {/* Operation Bar */}
        <Box sx={{
          background: '#161623',
          borderRadius: '12px',
          p: 2,
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <Typography sx={{ color: '#9ca3af', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, letterSpacing: 1 }}>
            <span style={{ fontSize: '1.2rem' }}>⚙</span> OPERATION
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, ml: { md: 'auto' } }}>
            {[
              { id: 'CONVERT', label: 'CONVERT', icon: '⇌' },
              { id: 'COMPARE', label: 'COMPARE', icon: '⚖' },
              { id: 'ADD', label: 'ADD', icon: '+' },
              { id: 'SUBTRACT', label: 'SUBTRACT', icon: '-' },
              { id: 'DIVIDE', label: 'DIVIDE', icon: '÷' }
            ].map((op) => (
              <Button
                key={op.id}
                onClick={() => setActiveOperation(op.id)}
                sx={{
                  background: activeOperation === op.id ? 'rgba(76, 29, 149, 0.3)' : 'transparent',
                  border: activeOperation === op.id ? '1px solid #7c3aed' : '1px solid rgba(255,255,255,0.1)',
                  color: activeOperation === op.id ? '#ddd6fe' : '#9ca3af',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  letterSpacing: 0.5,
                  borderRadius: '8px',
                  px: 2,
                  py: 1,
                  display: 'flex',
                  gap: 1,
                  '&:hover': {
                    background: activeOperation === op.id ? 'rgba(76, 29, 149, 0.4)' : 'rgba(255,255,255,0.05)',
                    borderColor: activeOperation === op.id ? '#8b5cf6' : 'rgba(255,255,255,0.2)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>{op.icon}</span> {op.label}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Converter */}
        <Converter type={activeType} operation={activeOperation} />

        {/* History */}
        <History operation={activeOperation} />
      </Container>
    </Box>
  );
}