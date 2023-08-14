
const express = require('express');
const { registration, login,profileUpdate, ProfileDetails } = require('../controllers/UsersController');
const AuthVerifyMiddleware = require('../middleware/AuthVerifyMiddleware');
const { createTask, deleteTask, updateTask, updateTaskStatus, groupByStatus, taskStatusCount } = require('../controllers/TasksContoller');



const router = express.Router();


//-----------------User---------------------->
router.post('/registration',registration);
router.post('/login',login);
router.post('/profileUpdate',AuthVerifyMiddleware,profileUpdate)
router.get('/profileDetail',AuthVerifyMiddleware,ProfileDetails)


//----------------->Task----------------------->   
                                                                                      
router.post('/createTask',createTask)
router.get("/deleteTask/:id",AuthVerifyMiddleware,deleteTask);
router.get("/updateTask/:id",AuthVerifyMiddleware,updateTask);
router.get("/updateTaskStatus/:id/:status",AuthVerifyMiddleware,updateTaskStatus);
router.get('/groupByStatus/:status',groupByStatus)
router.get('/taskStatusCount',taskStatusCount)






module.exports=router;