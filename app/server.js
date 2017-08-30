const express = require('express');
const app = express();

const { recipient, tracker } = require('./controllers/routes.js');

app.get('/recipient', recipient);
app.get('/:id/tracker.png', tracker);

app.listen(3000, () => {
  console.log('Email tracker listening on port 3000!');
});
