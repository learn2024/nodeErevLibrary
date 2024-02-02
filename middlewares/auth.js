import Jwt from "jsonwebtoken";

//את הפונקציה הזו נזמן לפני כל פעולה שמתאפשרת רק למשתמש רשום
export const auth = (req, res, next) => {

    let token = req.headers["x-access-token"];
    if (!token)
        return res.status(401).send("you are not authorized");
    try {
        let user = Jwt.verify(token, process.env.JWT_SECRET);
        req.myUser = user;
        next();
    }
    catch (err) {
        return res.status(401).send("invalid token");
    }

}

export const authAdmin = (req, res, next) => {

    let token = req.headers["x-access-token"];
    if (!token)
        return res.status(401).send("you are not authorized");
    try {
        let user = Jwt.verify(token, process.env.JWT_SECRET);
        req.myUser = user;
        if (user.role != "ADMIN")
            return res.status(403).send('this operation is not allowed for you')
        next();
    }
    catch (err) {
        return res.status(401).send("invalid token");
    }

}