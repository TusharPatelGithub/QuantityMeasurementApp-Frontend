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

export default function Converter({ type, operation = 'CONVERT' }) {
  const units = unitsConfig[type] || [];
  const [firstUnit, setFirstUnit] = useState(units[0]);
  const [secondUnit, setSecondUnit] = useState(units[1] || units[0]);
  const [firstValue, setFirstValue] = useState(1);
  const [secondValue, setSecondValue] = useState(operation === 'CONVERT' ? '' : 1);
  const [error, setError] = useState('');
  const [resultText, setResultText] = useState('');

  useEffect(() => {
    const newUnits = unitsConfig[type] || [];
    setFirstUnit(newUnits[0]);
    setSecondUnit(newUnits[1] || newUnits[0]);
    setFirstValue(1);
    setSecondValue(operation === 'CONVERT' ? '' : 1);
    setResultText('');
    setError('');
  }, [type, operation]);

  const performOperation = useCallback(async () => {
    if (operation === 'CONVERT' && (isNaN(firstValue) || firstValue === '')) {
      setSecondValue('');
      setResultText('');
      return;
    }

    if (operation !== 'CONVERT' && (isNaN(firstValue) || firstValue === '' || isNaN(secondValue) || secondValue === '')) {
      setResultText('');
      return;
    }

    try {
      setError('');
      if (operation === 'CONVERT') {
        const data = await measurementService.convert(firstValue, firstUnit, type, secondUnit);
        if (data?.result !== undefined) {
          setSecondValue(data.result.toFixed(2));
          setResultText(`${firstValue} ${firstUnit} = ${data.result.toFixed(4)} ${secondUnit}`);
        }
      } else if (operation === 'COMPARE') {
        const data = await measurementService.compare(firstValue, firstUnit, secondValue, secondUnit, type);
        if (data?.result === 1) {
          setResultText(`${firstValue} ${firstUnit} is EQUAL to ${secondValue} ${secondUnit}`);
        } else {
          setResultText(`${firstValue} ${firstUnit} is NOT EQUAL to ${secondValue} ${secondUnit}`);
        }
      } else if (operation === 'ADD') {
        const data = await measurementService.add(firstValue, firstUnit, secondValue, secondUnit, type);
        setResultText(`${firstValue} ${firstUnit} + ${secondValue} ${secondUnit} = ${data.result} ${data.unit}`);
      } else if (operation === 'SUBTRACT') {
        const data = await measurementService.subtract(firstValue, firstUnit, secondValue, secondUnit, type);
        setResultText(`${firstValue} ${firstUnit} - ${secondValue} ${secondUnit} = ${data.result} ${data.unit}`);
      } else if (operation === 'DIVIDE') {
        const data = await measurementService.divide(firstValue, firstUnit, secondValue, secondUnit, type);
        setResultText(`${firstValue} ${firstUnit} ÷ ${secondValue} ${secondUnit} = ${data.result}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Operation failed');
      setResultText('');
    }
  }, [firstValue, firstUnit, secondValue, secondUnit, type, operation]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      performOperation();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [performOperation]);

  const handleSwap = () => {
    const tempUnit = firstUnit;
    setFirstUnit(secondUnit);
    setSecondUnit(tempUnit);
    if (operation !== 'CONVERT') {
      const tempVal = firstValue;
      setFirstValue(secondValue);
      setSecondValue(tempVal);
    }
  };

  const isConvert = operation === 'CONVERT';

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
        {/* First Item */}
        <Box sx={{ flex: 1, display: 'flex', gap: 2, flexDirection: 'column', minWidth: { xs: '100%', md: 0 } }}>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>
            {isConvert ? 'From' : 'First Quantity'}
          </Typography>
          <TextField
            label="Value"
            type="number"
            value={firstValue}
            onChange={(e) => setFirstValue(e.target.value)}
            fullWidth
            sx={inputSx}
          />
          <TextField
            select
            label="Unit"
            value={firstUnit}
            onChange={(e) => setFirstUnit(e.target.value)}
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

        {/* Second Item */}
        <Box sx={{ flex: 1, display: 'flex', gap: 2, flexDirection: 'column', minWidth: { xs: '100%', md: 0 } }}>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>
            {isConvert ? 'To' : 'Second Quantity'}
          </Typography>
          <TextField
            label={isConvert ? 'Result Value' : 'Value'}
            type={isConvert ? 'text' : 'number'}
            value={secondValue}
            onChange={(e) => {
              if (!isConvert) setSecondValue(e.target.value);
            }}
            InputProps={{ readOnly: isConvert }}
            fullWidth
            sx={{
              ...inputSx,
              '& .MuiOutlinedInput-root': {
                color: '#1a1a2e',
                ...inputSx['& .MuiOutlinedInput-root'],
                background: isConvert ? '#fdf2f1' : '#fafafa',
              }
            }}
          />
          <TextField
            select
            label="Unit"
            value={secondUnit}
            onChange={(e) => setSecondUnit(e.target.value)}
            fullWidth
            sx={inputSx}
          >
            {units.map(u => <MenuItem key={u} value={u} sx={{ fontFamily: "'DM Sans', sans-serif" }}>{u}</MenuItem>)}
          </TextField>
        </Box>
      </Box>

      {/* Result Formula Text */}
      {resultText && (
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
            fontWeight: 700,
            color: '#922b21',
            fontSize: '1.15rem',
            letterSpacing: 0.5
          }}>
            {resultText}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
