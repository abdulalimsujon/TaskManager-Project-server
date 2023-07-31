
const bcrypt = require('bcrypt')

exports.hashPassword = (password)=>{
    return new Promise((resolve,reject)=>{
        bcrypt.genSalt(12,(err,salt)=>{
            if(err){
                reject(err)
            }

            bcrypt.hash(password,salt,(error,hash)=>{
                if(error){
                    reject(error)
                }

                resolve(hash)
            })
        })
    })
}

exports.comparePassword = (password, hashPassword) => {
    return bcrypt.compare(password, hashPassword)
}  