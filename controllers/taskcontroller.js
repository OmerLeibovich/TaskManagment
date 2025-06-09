const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Render the task list page, optionally filtered by task status
const getTasks =  async (req, res) => {
    try {
        let tasks;
        const filter = req.query.filter;
        if (filter === 'done') {
          tasks = await prisma.task.findMany({
          where: { done: true },
          orderBy: { id: 'asc' }
        });
        } else if (filter === 'notdone') {
           tasks = await prisma.task.findMany({
          where: { done: false },
          orderBy: { id: 'asc' }
        });
        } else {
          tasks = await prisma.task.findMany({
            orderBy: { id: 'asc' }
          });
        }
        res.render('index', { tasks, filter });
      } catch (error) {
        res.status(400).json({ error: 'Failed to fetch users' });
      }
  };

// Adds a new task to the list and returns it with its generated ID
const addTask = async (req, res) => {
  try{
  const newTask = await prisma.task.create({
  data: {
          name: req.body.task,
          done: false,
        }
          });
        res.status(200).json(newTask);
        } catch (error) {
        res.status(400).json({ error: 'Failed to create task' });
      }
    };

// Toggles the 'done' status of a specific task by its ID
const changeToggle = async (req, res) => {
  const taskId = parseInt(req.params.id);
  try {
    const doneStatus = await prisma.task.findUnique({
      where: { id: taskId}
    });
    let newdoneStatus;
    if(doneStatus.done === true){
      newdoneStatus = false;
    }
    else{
      newdoneStatus = true;
    }
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { done:  newdoneStatus},
      },
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: 'Failed to change status' });
  }
};

// Deletes a task from the list by its ID if it exists
const deleteTask = async (req, res) => {
  const taskId = parseInt(req.params.id);
  try{
    const deleteTask = await prisma.task.delete({
      where:{ id: taskId}
    })

    res.status(200).json(deleteTask);
  }
  catch (error){
    res.status(400).json({ error: 'Failed to delete task' }); 
  }
};

// Updates the name of a task by its ID if it exists
const editTask =  async (req, res) => {
  const taskId = parseInt(req.params.id);
  const { newText } = req.body;
  try{
    const taskname = await prisma.task.update({
      where : { id : taskId},
      data : {name : newText},
    })
   res.status(200).json(taskname)
  }
  catch (error){
    res.status(400).json({ error: 'Failed to change task name'})
  }
};

module.exports = {
  getTasks,
  addTask,
  changeToggle,
  deleteTask,
  editTask
};
