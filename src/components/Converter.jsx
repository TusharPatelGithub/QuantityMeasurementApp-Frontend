import React, { useState, useEffect, useCallback } from 'react';
import { Box, TextField, MenuItem, IconButton, Typography, Alert, Paper } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { measurementService } from '../services/api';

const unitsConfig = {
  length: ['Feet', 'Inch', 'Yards', 'Centimeters'],
  volume: ['Litre', 'Millilitre', 'Gallon'],
  weight: ['Kilogram', 'Gram', 'Pound'],
  temperature: ['Celsius', 'Fahrenheit', 'Kelvin']
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#1a1a2e',
    borderRadius: '10px',
    fontFamily: "'DM Sans', sans-serif",
    background: '#fafafa',
    '&:hover fieldset': { borderColor: '#922b21' },
    '&.Mui-focused fieldset': { borderColor: '#922b21', borderWidth: 2 },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#922b21' },
  '& .MuiInputLabel-root': { fontFamily: "'DM Sans', sans-serif" },
  '& .MuiSelect-select': { fontFamily: "'DM Sans', sans-serif" },
};

export default function Converter({ type }) {
  const units = unitsConfig[type] || [];
  const [fromUnit, setFromUnit] = useState(units[0]);
  const [toUnit, setToUnit] = useState(units[1] || units[0]);
  const [fromValue, setFromValue] = useState(1);
  const [toValue, setToValue] = useState('');
  const [error, setError] = useState('');
  const [formulaText, setFormulaText] = useState('');

  useEffect(() => {
    const newUnits = unitsConfig[type] || [];
    setFromUnit(newUnits[0]);
    setToUnit(newUnits[1] || newUnits[0]);
    setFromValue(1);
    setToValue('');
    setFormulaText('');
  }, [type]);

  const performConversion = useCallback(async () => {
    if (isNaN(fromValue) || fromValue === '') {
      setToValue('');
      setFormulaText('');
      return;
    }
    try {
      setError('');
      const data = await measurementService.convert(fromValue, fromUnit, type, toUnit);
      if (data?.result !== undefined) {
        setToValue(data.result.toFixed(2));
        setFormulaText(`${fromValue} ${fromUnit} = ${data.result.toFixed(4)} ${toUnit}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Conversion failed');
    }
  }, [fromValue, fromUnit, toUnit, type]);

  useEffect(() => {
    performConversion();
  }, [performConversion]);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  return (
    <Paper elevation={0} sx={{
      p: { xs: 3, sm: 5 },
      borderRadius: '16px',
      background: '#fff',
      border: '1.5px solid #e5e7eb',
      boxShadow: '0 4px 24px rgba(146,43,33,0.08)',
    }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '10px', fontFamily: "'DM Sans', sans-serif" }}>
          {error}
        </Alert>
      )}

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1, sm: 3 },
        flexWrap: { xs: 'wrap', md: 'nowrap' },
      }}>
        {/* From */}
        <Box sx={{ flex: 1, display: 'flex', gap: 2, flexDirection: 'column', minWidth: { xs: '100%', md: 0 } }}>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>
            From
          </Typography>
          <TextField
            label="Value"
            type="number"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            fullWidth
            sx={inputSx}
          />
          <TextField
            select
            label="From Unit"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            fullWidth
            sx={inputSx}
          >
            {units.map(u => <MenuItem key={u} value={u} sx={{ fontFamily: "'DM Sans', sans-serif" }}>{u}</MenuItem>)}
          </TextField>
        </Box>

        {/* Swap Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: { xs: 0, md: 3 } }}>
          <IconButton
            onClick={handleSwap}
            sx={{
              width: 48, height: 48,
              background: 'linear-gradient(135deg, #922b21, #c0392b)',
              color: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(146,43,33,0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #7b241c, #a93226)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <SwapHorizIcon />
          </IconButton>
        </Box>

        {/* To */}
        <Box sx={{ flex: 1, display: 'flex', gap: 2, flexDirection: 'column', minWidth: { xs: '100%', md: 0 } }}>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>
            To
          </Typography>
          <TextField
            label="Result"
            value={toValue}
            InputProps={{ readOnly: true }}
            fullWidth
            sx={{
              ...inputSx,
              '& .MuiOutlinedInput-root': {
    color: '#1a1a2e',
                ...inputSx['& .MuiOutlinedInput-root'],
                background: '#fdf2f1',
              }
            }}
          />
          <TextField
            select
            label="To Unit"
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            fullWidth
            sx={inputSx}
          >
            {units.map(u => <MenuItem key={u} value={u} sx={{ fontFamily: "'DM Sans', sans-serif" }}>{u}</MenuItem>)}
          </TextField>
        </Box>
      </Box>

      {/* Formula */}
      {formulaText && (
        <Box sx={{
          mt: 4,
          p: 2.5,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #fdf2f1, #fff5f5)',
          border: '1px solid #fecaca',
          textAlign: 'center',
        }}>
          <Typography sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            color: '#922b21',
            fontSize: '1.05rem',
          }}>
            {formulaText}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
