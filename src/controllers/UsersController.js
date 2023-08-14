const { hashPassword, comparePassword } = require('../helper/auth');
const User = require("../models/UsersModel")
const jwt = require('jsonwebtoken')

//registration

exports.registration=async(req, res)=>{
    try {

        const { firstName,lastName, email, password,mobile,photo} = req.body;

       const img = photo || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAo5JREFUOE991EvoVlUUBfDf33yk+aoUfJSCSWiIFkphJD0Qk8gsGmgQKb4w8ZGog6yECAt1UJmTFDInDRIHiSRIJD5SwhI0DDHKgVBgkopgaFqxZH9y+fvhhcv3nbvPWXvvtdbZHW59uuAePIRH8DDG4BqON96fcAnXmxAdjUX+34n7sRLPYG+9h9ANT2BSJTmAz/ALLrdwWoD57YuXMQ/b8GkjWVf816imF2ZjET7CdlzM/hZgT7yC5ZiO3yqWiu/FkAI7U23+XfHB2FL7V+BqAMPZSHyOVxtgd+N5ZGN4Oo9/8AV24a/qYBC+wjvYE8CBWIsfq81864/5eBSrcBp34AHMxVC8XtV2L26zfi2Hn6yyH6yMPTAZc4rTzj5IsndxDu9VMPwvTncBXNZQNvF+WI3wtamNraL2Y7XnuYrfleowLIBb8SV2V3AANuNj7GsDmDPD8S1GVDx0jMMnCf6Aafijgu1aauKGkinF5YuNwH04HMBjmNoAzIFnS7W0FHVzS/Kk3Rh/Hb4rD7Yw8/1QAHdiI75pZOuNN/AU1uAkYu5RmFFJ3m7sj/Ui6u4AflieaimWYEgOlwFNlfsRe0ysq/gWYu68qT4X4KX4OICzio+0GQMPw8wiOetQ8nNVmCExuhJ+X+DRILZJYacCmMmyHgfxe9noV2wo67QR+gZAWg4lOXsW70esAIab8XVbUsEHZZl2QM1vGRDp7s2yXir+ujUc+tTIyvxbWpVevQ1izkXxWCUXI+MrwDenTf5H2UybiJC7nXkX0Cv4t8AjWMRJdY9jAU60wDoDZh11F2IJduBoiXKhkudaxh6h5oW6mplSN5/mxG59TAUT8HRxOxYxe6r8s6bSkbLSqc60/A9RX4qkRAR+rgAAAABJRU5ErkJggg=="

        if (!firstName) {
            return res.json({ error: 'name is required' })
        }

        if (!email) {
            return res.json({ error: "email is required" })
        }

        if (!password && password.length < 6) {
            return res.json({ error: 'password must be 6 characters' })
        }

        const existUser = await User.findOne({ email: email })
        
        if (existUser) {
            res.json({error:"Email is taken"})
        }


        //hashed password 

        const hash = await hashPassword(password)

        const user = await new User({

            email,
            firstName,
            lastName,
            mobile,
            password: hash,
            photo : img
            
        }).save();

        

        //create token

        const token = jwt.sign({
            data: email
        }, process.env.JWT_SECRATE, { expiresIn: '7d' })

        res.json(
            {
                user: {
                    firstName:user.firstName,
                    lastName:user.lastName,
                    password:user.password,
                    email: user.email,
                    mobile:user.mobile,
                     photo:user.photo,
                    password:user.hash              
                },

             token
            })

    } catch (error) {

        console.log({error})

    }

}

 //---------------login------------------------

exports.login=async(req,res)=>{

       // 1. destructure name, email, password from req.body
      const { email, password } = req.body;
      // 2. all fields require validation
      if (!email) {
        return res.json({ error: "Email is required" });
      }
      if (!password || password.length < 6) {
        return res.json({ error: "Password must be at least 6 characters long" });
      }
      // 3. check if email is taken
      const existUser = await User.findOne({ email: email })


    
        
      if (!existUser) {
          res.json({error:"Not and user"})
          
      }

      // 4. compare password
      const match = await comparePassword(password, existUser.password);
      if (!match) {
        return res.json({ error: "Invalid email or password" });
      }

    User.aggregate([
        {$match:{email}},
        {$project:{_id:0,email:1,firstName:1,lastName:1,mobile:1}}
    
    ],(error,data)=>{
        if(error){
           return res.status(400).json({status:error,data:error})
        }else{
            if(data.length>0){
                let paylaod = {exp: Math.floor(Date.now()/1000)+(24*60*60),data:data[0]}

                let token = jwt.sign(paylaod,process.env.JWT_SECRATE)
             return   res.status(200).json({status:"success",token:token,data:existUser})
            }else{
           return  res.status(401).json({status:'unauthorized user'})
            }
        }
    })
        
   
  
      
}


//---------------------profile update-------------------------------


exports.profileUpdate=(req,res)=>{

    const email = req.headers['email']

    let reqBody= req.body;

    User.updateOne({email:email},reqBody,(error,data)=>{

        if(data?.error){
            res.status(400).json({status:'fail',data:error})
            return false;
        }else{
            
            res.status(200).json({status:'success',data:data})
            return true
        }

    })

}

// -------------profile details-------------------------------->


exports.ProfileDetails=(req,res)=>{

    const email = req.headers.email;

    User.aggregate([
        {$match:{email}},
        {$project:{_id:1,email:1,firstName:1,lastName:1,mobile:1,photo:1}}
    ],(error,data)=>{
    
        if(error){
            res.status(400).json({status:"fail",data:error})
        }else{

            
         
            res.status(200).json({status:"success",data:data})
        }

    })
}


  


