require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to the database
connectDB();

const app = express();

// Init Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require('path');

// Serve specific static asset folders to prevent exposing backend code
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Serve specific HTML pages directly
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/contacts.html', (req, res) => res.sendFile(path.join(__dirname, 'contacts.html')));
app.get('/about-us.html', (req, res) => res.sendFile(path.join(__dirname, 'about-us.html')));


app.get('/api', (req, res) => {
  res.json({ message: 'PizzaHouse API Running' });
});

// Mount Routes
app.use('/api/public', require('./routes/public'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
