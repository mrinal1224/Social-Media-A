import jwt from "jsonwebtoken";

const genToken = async (id) =>{
    try {
        const token = jwt.sign({id}, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
        return token;
    } catch (error) {
        throw new Error("Error generating token");
    }
}

export default genToken;
