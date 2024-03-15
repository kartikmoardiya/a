const jwt = require('jsonwebtoken');
const { use } = require('passport');
const secretKey = 'secretkey'
const jwtAuthMiddleware = (req, resp, next) => {
    const authorization = req.headers['authorization']

    if (!authorization) {
        return resp.status(401).json({ error: "Token Not Found" })
    }

    const token = authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try{
        const decoded = jwt.verify(token,secretKey);
        req.user = jwt.decode
        console.log(decoded)
        next()
    }catch(err){
        console.error(err);
        resp.status(401).json({ error: 'Invalid token' });
    }
}

const generateToken = (userData)=>{
   return jwt.sign(userData, secretKey, {expiresIn:30000})
}

module.exports = {jwtAuthMiddleware, generateToken};