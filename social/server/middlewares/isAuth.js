import jwt from 'jsonwebtoken'

const isAuth = async(req , res , next)=>{
    const token=req.cookies.token
    if(!token){
        return res.status(401).json({message:"Not authorized , no token"})
    }

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
         req.userId = decoded.id
        next()
    } catch (error) {
        return res.status(401).json({message:"Not authorized , token failed"})
    }
}

export default isAuth