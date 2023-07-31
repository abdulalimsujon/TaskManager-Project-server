const { hashPassword } = require('../helper/auth');
const User = require('../models/UsersModel')
const jwt = require('jsonwebtoken')

//registration

exports.registration=async(req, res)=>{
    try {

        const { firstName,lastName, email, password,photo,mobile} = req.body;

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
        console.log(existUser);
        if (existUser) {
            res.json({ error: "Email is taken" })
        }


        //hashed password 

        const hash = await hashPassword(password)

        const user = await new User({

            email,
            firstName,
            lastName,
            mobile,
            password: hash,
            photo
            
        }).save();

        //create token

        const token = jwt.sign({
            data: email
        }, process.env.JWT_SECRATE, { expiresIn: '7d' })



        res.json(
            {
                user: {
                    firstName: user.firstName,
                    lastName:user.lastName,
                    password:user.password,
                    email: user.email,
                    mobile:user.mobile,
                    photo:user.photo
                
                },

                token

            })

    } catch (error) {

        console.log(error)

    }

}

 //---------------login------------------------

exports.login=(req,res)=>{
    let {email,password} = req.body;

    console.log(email)
    console.log(password)

    User.aggregate([
        {$match:{email}},
        {$project:{_id:0,email:1,firstName:1,lastName:1,mobile:1}}
    
    ],(error,data)=>{
        if(error){
            res.status(400).json({status:error,data:error})
        }else{
            if(data.length>0){
                let paylaod = {exp: Math.floor(Date.now()/1000)+(24*60*60),data:data[0]}

                let token = jwt.sign(paylaod,process.env.JWT_SECRATE)
                res.status(200).json({status:"success",token:token,data:data[0].email})
            }else{
                res.status(401).json({status:'unauthorized user'})
            }
        }
    })
}


//---------------------profile update-------------------------------


exports.profileUpdate=(req,res)=>{

    const email = req.headers['email'];

    // console.log("======>",email);

    let reqBody = req.body;

    // console.log(reqBody)

    User.updateOne({email:email},reqBody,(error,data)=>{

        if(error){
            res.status(400).json({status:'fail',data:error})
        }else{
            res.status(200).json({status:'success',data:data})
        }

    })

}




  


