import { Request, Response,Router } from "express";
import { User } from "../entities/User";
import {validate } from 'class-validator';


const router = Router()

const register = async(req:Request,res:Response) => {
  const{email,username,password} = req.body;
  try {
   //validate data, check if exist
   let errors:any= {}
   const emailUser = await User.findOne({email})
   const usernameUser = await User.findOne({username})

   if(emailUser) errors.email = 'Email is already taken';
   if(usernameUser) errors.usernameUser = 'username is already taken';

   if(Object.keys(errors).length>0){
     return res.status(400).json({errors})
    }

   //create user
    const user= new User({email, username,password})
    errors = await validate(user)
    if(errors.length>0){
     return res.status(400).json({errors})
    }
    await user.save()

   //return user
   return res.json(user)
  }catch(err){
   return res.status(500).json(err)
  }
}
router.post('/register',register)
export default router