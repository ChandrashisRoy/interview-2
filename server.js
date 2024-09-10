require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('https://wft-geo-db.p.rapidapi.com/v1/geo/cities', async (req, res) => {
    const query = req.query.query || '';
    const options = {
        method: 'GET',
        url: process.env.API_URL,
        headers: {
            'x-rapidapi-key': process.env.API_KEY,
            'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
        },
        params: { namePrefix: query }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});