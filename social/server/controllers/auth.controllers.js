import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js"


export const signUp = async(req , res)=>{
    const {name , email,password , userName} = req.body

    if(!name || !email || !password || !userName){
        return res.status(400).json({message:"All fields are required"})
    }

    const exstingUserEmail = await User.findOne({email})
    if(exstingUserEmail){
        return res.status(400).json({message:"User with this email already exists"})
    }

    const exstingUserName = await User.findOne({userName})
    if(exstingUserName){
        return res.status(400).json({message:"User with this username already exists"})
    }

    if(password.length<6){
        return res.status(400).json({message:"Password must be at least 6 characters"})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password , salt)
    console.log(salt)



   const newUser =  await User.create({name , email,password:hashedPassword, userName})
    const token = await genToken(newUser._id)


    res.cookie("token", token, {
        httpOnly: true,
        sameSite:'strict',
        maxAge: 30*24*60*60*1000 // 30 days
        
    });


    console.log(token)
    res.status(201).json(newUser)
}


export const signIn = async(req , res)=>{
    const {password , userName} = req.body
    console.log(req.body)

    if(!password || !userName){
        return res.status(400).json({message:"All fields are required"})
    }

    const user = await User.findOne({userName})
    console.log(user)
    if(!user){
        return res.status(400).json({message:"Invalid UserName"})
    }

    const isPasswordCorrect = await bcrypt.compare(password , user.password)
    console.log(isPasswordCorrect)

    if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid Password"})
    }

    const token = await genToken(user._id)
      res.cookie("token", token, {
        httpOnly: true,
        sameSite:'strict',
        maxAge: 30*24*60*60*1000 // 30 days
        
    });
    console.log(token)

    res.status(200).json(user)    
 } 