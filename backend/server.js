const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all routes

app.get('/proxy', async (req, res) => {
  const { url } = req.query; // Get the URL from query parameters

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        // You can set any headers here if needed
      },
    });
    res.send(response.data); // Send the fetched data back to the client
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the URL' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
