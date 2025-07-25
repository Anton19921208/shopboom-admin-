import { useState, useEffect } from 'react';
import Login from './Login';
import './App.css';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Switch, FormControlLabel } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const drawerWidth = 220;
const API_URL = import.meta.env.VITE_API_URL + '/api/products'; // Замените на свой backend при деплое

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', description: '', image: '', category: '' });
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ _id: '', name: '', price: '', description: '', image: '', category: '' });
  const [editing, setEditing] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setProducts(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpen = () => {
    setForm({ name: '', price: '', description: '', image: '', category: '' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleAdd = () => {
    setAdding(true);
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        description: form.description,
        image: form.image,
        category: form.category
      })
    })
      .then(res => res.json())
      .then(() => {
        setOpen(false);
        fetchProducts();
      })
      .finally(() => setAdding(false));
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => fetchProducts())
      .finally(() => setDeletingId(null));
  };

  const handleEditOpen = (product) => {
    setEditForm(product);
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);
  const handleEditChange = e => {
    setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleEditSave = () => {
    setEditing(true);
    fetch(`${API_URL}/${editForm._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editForm.name,
        price: Number(editForm.price),
        description: editForm.description,
        image: editForm.image,
        category: editForm.category
      })
    })
      .then(res => res.json())
      .then(() => {
        setEditOpen(false);
        fetchProducts();
      })
      .finally(() => setEditing(false));
  };

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Товары</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>Добавить товар</Button>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Цена</TableCell>
                <TableCell>Описание</TableCell>
                <TableCell>Изображение</TableCell>
                <TableCell>Категорія</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.price}₴</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.image ? <img src={row.image} alt="img" style={{ maxWidth: 60, maxHeight: 40 }} /> : '-'}</TableCell>
                  <TableCell>{row.category || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleEditOpen(row)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(row._id)} disabled={deletingId === row._id}>
                      {deletingId === row._id ? <CircularProgress size={20} /> : <DeleteIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Добавить товар</DialogTitle>
        <DialogContent>
          <TextField label="Название" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Цена" name="price" value={form.price} onChange={handleChange} type="number" fullWidth margin="normal" />
          <TextField label="Описание" name="description" value={form.description} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="URL изображения" name="image" value={form.image} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Категорія" name="category" value={form.category} onChange={handleChange} fullWidth margin="normal" />
          <div style={{fontSize: '0.95em', color: '#888', marginTop: '-10px', marginBottom: '10px'}}>
            Введіть категорію товару, наприклад: Одяг, Електроніка, Аксесуари...
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleAdd} variant="contained" color="primary" disabled={adding}>
            {adding ? <CircularProgress size={20} /> : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Редактировать товар</DialogTitle>
        <DialogContent>
          <TextField label="Название" name="name" value={editForm.name} onChange={handleEditChange} fullWidth margin="normal" />
          <TextField label="Цена" name="price" value={editForm.price} onChange={handleEditChange} type="number" fullWidth margin="normal" />
          <TextField label="Описание" name="description" value={editForm.description} onChange={handleEditChange} fullWidth margin="normal" />
          <TextField label="URL изображения" name="image" value={editForm.image} onChange={handleEditChange} fullWidth margin="normal" />
          <TextField label="Категорія" name="category" value={editForm.category} onChange={handleEditChange} fullWidth margin="normal" />
          <div style={{fontSize: '0.95em', color: '#888', marginTop: '-10px', marginBottom: '10px'}}>
            Введіть категорію товару, наприклад: Одяг, Електроніка, Аксесуари...
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Отмена</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary" disabled={editing}>
            {editing ? <CircularProgress size={20} /> : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function OrdersPage() {
  return <Box p={3}><Typography variant="h4">Заказы</Typography><Typography>Здесь будет просмотр заказов.</Typography></Box>;
}

function Dashboard({ onLogout }) {
  const [page, setPage] = useState('products');
  const [siteEnabled, setSiteEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/api/settings')
      .then(res => res.json())
      .then(data => setSiteEnabled(data.siteEnabled !== false))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = () => {
    setSaving(true);
    fetch(import.meta.env.VITE_API_URL + '/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteEnabled: !siteEnabled })
    })
      .then(res => res.json())
      .then(data => setSiteEnabled(data.siteEnabled !== false))
      .finally(() => setSaving(false));
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Админ-панель магазина
          </Typography>
          <FormControlLabel
            control={<Switch checked={siteEnabled} onChange={handleToggle} color="primary" disabled={loading || saving} />}
            label={siteEnabled ? 'Сайт увімкнено' : 'Сайт вимкнено'}
            sx={{ color: '#fff', mr: 2 }}
          />
          <Button color="inherit" onClick={handleReload} sx={{ mr: 2 }}>
            Перезавантажити сайт
          </Button>
          <IconButton color="inherit" onClick={onLogout} title="Вийти">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', background: '#222', color: '#fff' },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button selected={page === 'products'} onClick={() => setPage('products')}>
            <ListItemIcon><Inventory2Icon sx={{ color: '#fff' }} /></ListItemIcon>
            <ListItemText primary="Товары" />
          </ListItem>
          <ListItem button selected={page === 'orders'} onClick={() => setPage('orders')}>
            <ListItemIcon><ShoppingCartIcon sx={{ color: '#fff' }} /></ListItemIcon>
            <ListItemText primary="Заказы" />
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f4f6fa', minHeight: '100vh', ml: `${drawerWidth}px` }}>
        <Toolbar />
        {page === 'products' && <ProductsPage />}
        {page === 'orders' && <OrdersPage />}
      </Box>
    </Box>
  );
}

function App() {
  const [isAuth, setIsAuth] = useState(false);

  if (!isAuth) {
    return <Login onLogin={() => setIsAuth(true)} />;
  }

  return <Dashboard onLogout={() => setIsAuth(false)} />;
}

export default App;
