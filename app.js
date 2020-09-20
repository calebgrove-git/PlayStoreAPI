const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const playstore = require('./playstore');
const app = express();

app.use(cors());
app.use(morgan('common'));

app.get('/apps', (req, res) => {
  const { sort, genres } = req.query;
  if (sort) {
    if (!['Rating', 'App'].includes(sort)) {
      return res.status(400).send('Sort must be by Rating or App');
    }
  }
  if (genres) {
    if (
      !['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(
        genres
      )
    ) {
      return res
        .status(400)
        .send(
          'Genres must be Action, Puzzle, Strategy, Casual, Aracde, or Card'
        );
    }
  }
  let results = playstore;
  if (genres) {
    results = results.filter((app) => app.Genres === genres);
  }
  if (sort === 'Rating') {
    results.sort((a, b) => {
      return a[sort] < b[sort] ? 1 : a[sort] > b[sort] ? -1 : 0;
    });
  }
  if (sort === 'App') {
    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }
  res.json(results);
});
app.listen(8000, () => {
  console.log('Server started on port 8000');
});
