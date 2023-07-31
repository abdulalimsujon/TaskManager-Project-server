
const express = require('express');
const { registration, login,profileUpdate } = require('../controllers/UsersController');
const AuthVerifyMiddleware = require('../middleware/AuthVerifyMiddleware');
const { createTask, deleteTask, updateTask, updateTaskStatus, groupByStatus, taskStatusCount } = require('../controllers/TasksContoller');



const router = express.Router();


//-----------------User---------------------->
router.post('/registration',registration);
router.post('/login',login);
router.post('/profileUpdate',AuthVerifyMiddleware,profileUpdate)


//----------------->Task----------------------->
                                                                                           
router.post('/createTask',AuthVerifyMiddleware,createTask)
router.delete("/deleteTask/:id",AuthVerifyMiddleware,deleteTask);
router.get("/updateTask/:id",AuthVerifyMiddleware,updateTask);
router.get("/updateTaskStatus/:id/:status",AuthVerifyMiddleware,updateTaskStatus);
router.get('/groupByStatus/:status',AuthVerifyMiddleware,groupByStatus)
router.get('/taskStatusCount',AuthVerifyMiddleware,taskStatusCount)




module.exports=router;