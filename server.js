require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// ── Middleware ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── API Routes (must come BEFORE static serving) ───────────
app.get('/api', (req, res) => {
  res.json({ message: 'PizzaHouse API Running' });
});

app.use('/api/public', require('./routes/public'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));

// ── Static File Serving ────────────────────────────────────
// Serves ANY file from the root dir (css, js, images, fonts, etc.)
// Placed AFTER API routes so /api/* paths are never intercepted.
app.use(express.static(__dirname));

// ── HTML Page Routes ───────────────────────────────────────
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/contacts', (req, res) => res.sendFile(path.join(__dirname, 'contacts.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'about-us.html')));

// ── Start Server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
