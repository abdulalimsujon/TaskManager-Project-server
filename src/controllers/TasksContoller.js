
const Task = require('../models/TasksModel')


exports.createTask=(req,res)=>{
    

    try{
        const email = req.headers['email']

        const {title,description,status} = req.body;
        if (!title) {
            return res.json({ error: 'title is required' })
        }
        if (!description) {
            return res.json({ error: 'description is required' })
        }
        if (!status) {
            return res.json({ error: 'status is required' })
        }
    
        new Task({
            title,
            description,
            email,
            status
        }).save()
    
        res.json({
            task:{
                title,
                description,
                email,
                status
            }
        })
    

    }catch(error){
       console.log(error)
    }
   
}

//-----------------delete task---------------------->

exports.deleteTask =(req,res)=>{
    const id = req.params.id;

    console.log(id)

    Task.remove({_id:id},(error,data)=>{
        if(error){
            res.status(400).json({status:"fail",data:error})
        }else{
            res.status(200).json({status:"success",data:data})
        }
    })
}

//------------------update task------------------------


exports.updateTask =(req,res)=>{

    const {status,description,title} = req.body;
    const id = req.params.id;

    Task.findOneAndUpdate({_id:id},
        {
           status,description,title 
        },(error,data)=>{
        if(error){
            res.status(400).json({status:"fail",data:error})
        }else{
            res.status(200).json({status:"success",data:data})
        }
    })
}

//-----------------------update status------------------------>

exports.updateTaskStatus =(req,res)=>{

    const id = req.params.id;
    console.log(id)
    const status = req.params.status;
    console.log(status)

    Task.findOneAndUpdate({_id:id},
        {
           status:status
        },(error,data)=>{
        if(error){
            res.status(400).json({status:"fail",data:error})
        }else{
            res.status(200).json({status:"success",data:data})
        }
    })
}



//---------------group by status--------------------->

exports.groupByStatus=(req,res)=>{

    const status = req.params.status;
    const email = req.headers['email'];

    Task.aggregate([{
        $match:{status:status,email:email}},
        {$project:{
            _id:1,title:1,status:1,discription:1,
            createDate:{
                $dateToString:{
                    date:"$createDate",
                    format:"%d-%m-%Y"
                }
            }
        }
    }],(error,data)=>{
        if(error){
            res.status(400).json({status:"fail",data:error})
        }else{
            res.status(200).json({status:'success',data:data})
        }
    })
}


//--------------------count by group------------------------>


 exports.taskStatusCount =(req,res)=>{

  const email = req.headers["email"]
  const status = req.params.status;

  Task.aggregate([
    {$group:{_id:"$status",sum:{$count:{}}}}

],(error,data)=>{
    if(error){
        res.status(400).json({status:'fail',data:error})
    }else{
        res.status(200).json({status:'success',data:data})
    }
})

}

