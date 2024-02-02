import Joi from "joi";
import mongoose from "mongoose";
import Jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
    userName: String,
    password: String,
    email: String, 
    role: { type: String, default: "USER" }
})

export const userModel = mongoose.model("users", userSchema);


export const validateUser = (_user) => {
    const uSchema = Joi.object({

        userName: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().email().required()
    })
    //יש לרשום את כל השדות שיכולים להיות באובייקט ולא רק את מה שנרצה לבדוק
    //כי מה שלא נרשום כאן - אם ישלחו אותו זה יחשב לשגיאה
    return uSchema.validate(_user);//פונקציה שמורה של סכמות שמקבלת אובייקט ובודקת האם הוא עומד בסכמה
    //אם לא מחזירה הודעות בהתאם למה שלא תואם לסכמה
}


export const validateUserLogin = (_user) => {
    const uSchema = Joi.object({

        userName: Joi.string(),//שדה שאינו חובה
        password: Joi.string().required(),
        email: Joi.string().email().required(),
      
    })
    //יש לרשום את כל השדות שיכולים להיות באובייקט ולא רק את מה שנרצה לבדוק
    //כי מה שלא נרשום כאן - אם ישלחו אותו זה יחשב לשגיאה
    return uSchema.validate(_user);//פונקציה שמורה של סכמות שמקבלת אובייקט ובודקת האם הוא עומד בסכמה
    //אם לא מחזירה הודעות בהתאם למה שלא תואם לסכמה
}

export const generateToken = (userName, _id, role) => {
    //את פהונהקציה הזו מזמנים בלוגין או בהרשמה אחרי שההרשמה או הכניסה הצליחו
    //אז נייצר טוקן ונחזייר גם אותו לקליינט
    let token = Jwt.sign({ userName, _id, role }, process.env.JWT_SECRET || "SDfdsfdsf", {
        expiresIn: "4m"//תוך כמה זמון יפוג תוקף הטוקן
    })
    return token;
}
