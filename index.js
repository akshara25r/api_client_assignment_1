require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const MenuItem = require('./schema');

const app = express();

app.use(express.json());
app.use(cors());

//  MongoDB Atlas Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log(' Connected to MongoDB Atlas'))
  .catch((err) => console.error(' MongoDB connection error:', err));

//  Route: Create a New Menu Item
app.post('/menu', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: ' Name and Price are required',
      });
    }

    const newMenuItem = new MenuItem({ name, description, price });
    await newMenuItem.save(); 

    res.status(201).json({
      success: true,
      message: ' New menu item created successfully',
      data: newMenuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ' Error creating menu item',
      error: error.message,
    });
  }
});

// ✅ Route: Fetch All Menu Items
app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Error fetching menu items',
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
