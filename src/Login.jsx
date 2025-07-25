import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

const ADMIN_PASSWORD = 'admin123'; // Замените на свой пароль!

function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setError('');
      onLogin();
    } else {
      setError('Неверный пароль');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#222">
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" align="center" gutterBottom>Вход в админ-панель</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Пароль администратора"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            autoFocus
          />
          {error && <Typography color="error" align="center">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Войти
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Login; 