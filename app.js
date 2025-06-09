const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let tasks = [];
let nextId = 0;
// Render the task list page, optionally filtered by task status
app.get('/', (req, res) => {
  const filter = req.query.filter;
  let filteredTasks = tasks;

  if (filter === 'done') {
    filteredTasks = tasks.filter(task => task && task.done);
  } else if (filter === 'notdone') {
    filteredTasks = tasks.filter(task => task && !task.done);
  } else {
    filteredTasks = tasks.filter(task => task);
  }

  res.render('index', { tasks: filteredTasks, filter });
});

// Adds a new task to the list and returns it with its generated ID
app.post('/tasks', (req, res) => {
  const task = req.body.task;
  if (task) {
    const newTask = { id: nextId++, name: task, done: false };
    tasks.push(newTask);
    return res.json(newTask);
  }
  res.status(400).json({ error: 'Missing task' });
});

// Toggles the 'done' status of a specific task by its ID
app.post('/tasks/:id/toggle', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t && t.id === taskId);
  if (task) {
    task.done = !task.done;
    res.sendStatus(200);
  } else {
    res.sendStatus(404); 
  }
});

// Deletes a task from the list by its ID if it exists
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const index = tasks.findIndex(t => t && t.id === taskId);
  if (index !== -1) {
    tasks.splice(index, 1);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Updates the name of a task by its ID if it exists
app.post('/tasks/:id/rename', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { newText } = req.body;

  const task = tasks.find(t => t && t.id === taskId);

  if (task && newText && newText.trim() !== '') {
    task.name = newText.trim();
    return res.sendStatus(200);
  }

  res.sendStatus(400);
});



app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
}); 