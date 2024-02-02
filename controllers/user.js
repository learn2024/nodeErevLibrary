import { generateToken, userModel, validateUser, validateUserLogin } from "../models/user.js";
import bcryptjs from "bcryptjs";

export const getAllUsers = async (req, res) => {
    try {

        let allUsers = await userModel.find({});
        return res.json(allUsers);
    }
    catch (err) {
        res.status(400).json(err)
    }

}

export const addUser = async (req, res) => {
    try {

        let { userName, password, email } = req.body;//בדיקה האם נשלחו כל הפרטים

        // if (!userName || !password || !email)
        //     return res.status(404).send("missing parameters userName or password or email")

        // if (password.length < 3 || !/^[0-9a-zA-Z]{3,5}$/.test(password))
        //     return res.status(400).send('password is incorrect')

        let result = validateUser(req.body);
        console.log(result)
        if (result.error)
            return res.status(400).send(result.error.details[0].message)
        let sameUser = await userModel.findOne({ email });//בדיקה האם קיים כבר מתשמש כזה
        if (sameUser)
            return res.status(409).send("there is already such user");
        let hashedPassword = await bcryptjs.hash(password, 15);

        let newUser = new userModel({ userName, password: hashedPassword, email });
        await newUser.save()
        let token = generateToken(newUser.userName, newUser._id, newUser.role);
        // newUser.password = "*****";
        return res.status(201).json({ userName: newUser.userName, role: newUser.role, _id: newUser._id, token });

    }
    catch (err) {
        res.status(400).send(err.message)
    }

}

export const loginUser = async (req, res) => {

    try {

        let { password, email } = req.body;
        // if (!password || !email)
        //     return res.status(404).send("missing parameters userName or password or email")
        let result = validateUserLogin(req.body);

        if (result.error)
            return res.status(400).send(result.error.details[0].message)


        let isUser = await userModel.findOne({ email });//שלפנו את המשתמש שיש לו כזה מייל
        if (!isUser)//אם לא נמצא החזרנו שגיאה
            return res.status(400).send("email not exsits");
        if (!await bcryptjs.compare(password, isUser.password))//אם נמצא אך הסיסמא לא תואמת
            return res.status(400).send("incorrect password");


        // isUser.password = "*****";
        let token = generateToken(isUser.userName, isUser._id, isUser.role);

        return res.status(200).json({ userName: isUser.userName, role: isUser.role, _id: isUser._id, token });


    } catch (err) {
        res.status(400).json(err)
    }
}