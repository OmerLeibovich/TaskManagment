const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/pages');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let tasks = [];

app.get('/', (req, res) => {
  res.render('index', { tasks });
});

app.post('/tasks', (req, res) => {
  const task = req.body.task;
  if (task) {
    const newTask = { name: task, done: false };
    tasks.push(newTask);
    const id = tasks.length - 1;
    return res.json({ id, ...newTask });
  }
  res.status(400).json({ error: 'Missing task' });
});

app.post('/tasks/:id/toggle', (req, res) => {
  const taskId = parseInt(req.params.id);
  if (!isNaN(taskId) && tasks[taskId]) {
    tasks[taskId].done = !tasks[taskId].done;
    res.sendStatus(200); 
  } else {
    res.sendStatus(400); 
  }
});

app.delete('/tasks/:id', (req,res) => {
  const taskId = parseInt(req.params.id);
  if (!isNaN(taskId) && tasks[taskId]) {
  delete tasks[taskId];
  res.sendStatus(200);
  }
  else{
    res.sendStatus(400);
  }
})

app.post('/tasks/:id/rename', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { newText } = req.body;
  if (!isNaN(taskId) && tasks[taskId]) {
    tasks[taskId].name = newText;
    return res.sendStatus(200);
  }

  res.sendStatus(400);
});




app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
