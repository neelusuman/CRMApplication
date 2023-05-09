const User = require("../models/user.model")
const {userType}= require ("../utils/constants")
const constants= require( "../utils/constants")
const bcrypt = require('bcryptjs')
const jwt = require ('jsonwebtoken')
const config = require('../configs/auth.config')


exports.signup = async ( request, response)=>{
    let userStatus

        if(request.userType==userType.engineer || 
            request.userType == userType.admin){
                userStatus = constants.userStatus.pending
            }else {
                userStatus = constants.userStatus.approved
            }
    
    const userObj = {
        name: request.body.name,
        userId: request.body.userId,
        email: request.body.email,
        userType:request.body.userType,
        password: bcrypt.hashSync(request.body.password, 8),
        userStatus: userStatus
    }
    try {
        const userCreated= await User.create (userObj)
        const postResponse = {
            name : userCreated.name,
            userId : userCreated.userId,
            email : userCreated.email,  
            userType: userCreated.userType,
            userStatus : userCreated.userStatus,
            createdAt : userCreated.createdAt,
            updatedAt : userCreated.updatedAt
        }
        response.status(201).send(postResponse)
    }catch(err){
        console.log("Something went wrong ", err.message)
        response.status(500).send({
            message : "Some internal error while inserting "
        })
    }
}


exports.signin = async (req, res)=>{
  const user = await User.findOne({userId : req.body.userId})
  console.log("signin req for", user)

  if(!user){
    res.status(400).send({
        message : "Failed! UserId doesn't exist"
    })
    return
  }

  if(user.userStatus!= constants.userStatus.approved){
    res.status(403).send({
        message : `Can't allow login as user is in status : [${user.userStatus}]`
    })
    return;
  }
  let passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
   if(!passwordIsValid){
    res.status(401).send({message: "Invalid Password"})
    return;
   }

   let token = jwt.sign({userId : user.userId},config.secret,{
    expiresIn : 86400 //24 hr
   })

   res.status(200).send({
    name : user.name,
    userId : user.userId,
    email : user.email,
    userType: user.userType,
    userStatus: user.userStatus,
    accessToken : token
   })
}