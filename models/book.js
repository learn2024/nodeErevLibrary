import Joi from "joi";
import mongoose from "mongoose";

const authorSchema = mongoose.Schema({
    firstName: String,
    lastName: String
});

const bookSchema = mongoose.Schema({
    name: String,
    numPages: Number,
    isComix: Boolean,
    publishDate: { type: Date, default: Date.now() },
    categories: [String],
    author: authorSchema,
    userAdded: String
})


//בנינו מבנה של פריט בתוך האוסף של הספרים
//collection בשורשה הבאה נקשר את המבנה הזה לשם ה

export const BookModel = mongoose.model("books", bookSchema);

export const validateBook = (_book) => {
    let bookJoi = Joi.object({
        name: Joi.string().min(2).max(40).required(),
        numPages: Joi.number().required(),
        isComix: Joi.boolean(),
        publishDate: Joi.date(),
        categories: Joi.array(),
        author: Joi.object({
            firstName: Joi.string(),
            lastName: Joi.string()
        })//לא הוספנו את השדה קוד משתמש שהכניס את הספר כי הוא לא יישלח מהקליינט ישירות
        //רק אנחנו נפענח את זה דרך הטוקן    


    })
    return bookJoi.validate(_book);

}