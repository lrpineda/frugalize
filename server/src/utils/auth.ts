import jwt from 'jsonwebtoken';

const secret = "hesgotasecret";
const expiresIn = "2h";

const authMiddleware = function ({req}:any){
    let token = req.body.token || req.query.token || req.headers.authorization;
        
        // ["Bearer", "<tokenvalue>"]
        if (req.headers.authorization) {
            // remove "Bearer" from string
            token = token.split(" ").pop().trim();
        }

        // if no token, return request object as is
        if (!token) {
            return req;
        }

        try {
            // decode and attach user data to request object
            const { data }:any  = jwt.verify(token, secret, { maxAge: expiresIn });
            req.user = data;
            console.log(typeof data);

        }catch (err) {
            console.log(err);
        }

        // return updated request object
        return req;
}

const signToken = function ({email, _id}:any){
    const payload = { email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn });
}

export { authMiddleware, signToken };