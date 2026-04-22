import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { measurementService } from '../services/api';

export default function History({ operation }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await measurementService.getHistory(operation);
        setHistory(data);
      } catch (err) {
        console.error('Failed to fetch history', err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    // Fetch initial history
    fetchHistory();
    
    // Set up auto-refresh every 3 seconds to reflect real-time changes
    const interval = setInterval(fetchHistory, 3000);
    return () => clearInterval(interval);
  }, [operation]);

  return (
    <Box sx={{ mt: 5 }}>
      <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, color: '#1a1a2e', mb: 2 }}>
        Recent {operation.toLowerCase()} operations
      </Typography>
      
      {loading && history.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress sx={{ color: '#922b21' }} />
        </Box>
      ) : history.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: '12px', background: '#fff', border: '1.5px dashed #e5e7eb' }}>
          <Typography sx={{ color: '#6b7280', fontFamily: "'DM Sans', sans-serif" }}>
            No recent operations found.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {history.map((record, idx) => (
            <Paper key={record.id || idx} elevation={0} sx={{
              p: 2.5, borderRadius: '12px', background: '#fff',
              border: '1.5px solid #e5e7eb', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}>
              <Box>
                <Typography sx={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, mb: 0.5 }}>
                  {record.measurementType}
                </Typography>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', color: '#1a1a2e', fontWeight: 500 }}>
                  {operation === 'CONVERT' && `${record.value1} → ${record.result.toFixed(4)} ${record.unit}`}
                  {operation === 'COMPARE' && `${record.value1} vs ${record.value2} (${record.unit}) = ${record.result === 1 ? 'EQUAL' : 'NOT EQUAL'}`}
                  {operation === 'ADD' && `${record.value1} + ${record.value2} = ${record.result} ${record.unit}`}
                  {operation === 'SUBTRACT' && `${record.value1} - ${record.value2} = ${record.result} ${record.unit}`}
                  {operation === 'DIVIDE' && `${record.value1} ÷ ${record.value2} = ${record.result} ${record.unit}`}
                </Typography>
              </Box>
              <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                {new Date(record.createdAt).toLocaleString()}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}
