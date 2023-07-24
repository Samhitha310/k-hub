const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/form_data', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected successfully');
    startServer();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const formDataSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  favoritefooditem: String, // Make sure the property name is "favoriteFoodItem"
});

const FormData = mongoose.model('FormData', formDataSchema);

app.use(bodyParser.json());

app.post('/api/submit', async (req, res) => {
  try {
    const { name, age, gender, favoritefooditem } = req.body;

    // Create a new FormData instance
    const formData = new FormData({
      name,
      age,
      gender,
      favoritefooditem, // Use the correct property name here       formchart delete cheyana
    });

    // Save the form data to MongoDB
    await formData.save();

    res.status(201).json({ message: 'Form data saved successfully' });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/formData', async (req, res) => {
  try {
    // Fetch all form data from MongoDB
    const formData = await FormData.find({});

    res.status(200).json(formData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

function startServer() {
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
