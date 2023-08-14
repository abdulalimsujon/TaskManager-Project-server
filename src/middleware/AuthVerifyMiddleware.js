
var jwt = require('jsonwebtoken')

module.exports =(req,res,next)=>{


    let token = req.headers['token'];


    jwt.verify(token,process.env.JWT_SECRATE,(error,decoded)=>{


        if(error){
            res.status(401).json({status:'unauthorize'})
        }else{
            let email = decoded['data']
            // console.log('eamil from middleware',email)
            req.headers = email;

            next()
        }

    })
}