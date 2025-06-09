const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskcontroller')

// Initializing paths
router.route('/').get(taskController.getTasks);
router.route('/tasks').post(taskController.addTask);
router.route('/tasks/:id/toggle').post(taskController.changeToggle);
router.route('/tasks/:id').delete(taskController.deleteTask);
router.route('/tasks/:id/rename').post(taskController.editTask);


module.exports = router;