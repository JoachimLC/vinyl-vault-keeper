const express = require('express');
const axios = require('axios');
const qs = require('qs');
const cors = require('cors');

const app = express();
app.use(cors());

const clientId = '938d14997d3c4cf0a9546a5fd6dfac2b'; // Your Client ID
const clientSecret = '6820b452758d47199acec0f90f6f5e91'; // Your Client Secret

let accessToken = '';
let tokenExpirationTime = 0;

// Function to get a new access token from Spotify
const getSpotifyToken = async () => {
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const authOptions = {
    method: 'post',
    url: tokenUrl,
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify({
      grant_type: 'client_credentials',
    }),
  };

  try {
    const response = await axios(authOptions);
    accessToken = response.data.access_token;
    tokenExpirationTime = Date.now() + response.data.expires_in * 1000; // Expiration time in milliseconds
    console.log('Access Token retrieved:', accessToken); // Log the access token for confirmation
  } catch (error) {
    console.error('Error getting Spotify token:', error.response ? error.response.data : error.message);
  }
};

// Middleware to check if the token is expired and refresh if necessary
const ensureSpotifyToken = async (req, res, next) => {
  if (!accessToken || Date.now() >= tokenExpirationTime) {
    await getSpotifyToken();
  }
  next();
};

// Route to fetch Spotify token
app.get('/spotify-token', ensureSpotifyToken, (req, res) => {
  if (accessToken) {
    res.json({ accessToken });
  } else {
    res.status(500).json({ error: 'Failed to retrieve access token' });
  }
});

// Start the server
app.listen(5001, () => {
  console.log('Spotify Token server running on http://localhost:5001');
});
