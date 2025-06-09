const taskRoutes = require('./routes/taskroute');

const express = require('express');
const app = express();

const port = process.env.PORT;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Call to all routes that start with '/' from task route
app.use('/', taskRoutes);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 