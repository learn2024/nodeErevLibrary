import mongoose from "mongoose";
import { BookModel, validateBook } from "../models/book.js";
//async/await
export const getAllBooks = async (req, res) => {
    //api/book
    //api/book?txt=fff
    let txt = req.query.txt || "";
    let page = req.query.page || 1;
    let perPage = req.query.perPage || 5;
    try {
        let arr = await BookModel.find({ name: new RegExp(txt) })
            .skip((page - 1) * perPage).limit(perPage);
        res.json(arr);
    }
    catch (err) {
        res.status(400).json(err)
    }
}

export const getBookById = async (req, res) => {
    let { id } = req.params;
    //אם הקוד שקיבלנו אינו הגיוני הוא נופל
    if (!mongoose.isValidObjectId(id))
        return res.status(404).send("id not valid format")
    try {
        let data = await BookModel.findOne({ _id: id });
        if (!data)
            return res.status(404).send("book with such id not found")
        res.json(data);
    }
    catch (err) {
        res.status(400).json(err)
    }
}



export const deleteBook = async (req, res) => {
    let id = req.params.id;
    if (!mongoose.isValidObjectId(id))
        return res.status(404).send("id not valid format")

    try {
        // let bookToDelete = await BookModel.findOne({_id:id })
        // let bookToDelete = await BookModel.findById(id);
        let deletedBook = await BookModel.findById(id);
        if (!deletedBook)
            return res.status(404).send("No book with such id to delete")
        if (req.myUser.role != "ADMIN" && req.myUser._id != deletedBook.userAdded)
            return res.status(403).send("only user added this book or manager are alloed to delete")
        deletedBook = await BookModel.findByIdAndDelete(id);
        return res.status(200).json(deletedBook)

    } catch (err) {
        res.status(400).json(err)
    }

}

export const updateBook = async (req, res) => {
    let id = req.params.id;
    if (!mongoose.isValidObjectId(id))
        return res.status(404).send("id not valid format")
    let { numPages, name, categories, publishDate, isComix } = req.body;
    try {


        // let bookToUpdate = await BookModel.findById(id);
        // if (!bookToUpdate)
        //     return res.status(404).send("No book with such id to update")
        // bookToUpdate.name = name || bookToUpdate.name;
        // bookToUpdate.isComix = isComix || bookToUpdate.isComix;
        // bookToUpdate.categories = categories || bookToUpdate.categories;
        // bookToUpdate.publishDate = publishDate || bookToUpdate.publishDate;
        // await bookToUpdate.save()
        // res.json(bookToUpdate)
        let bookToUpdate = await BookModel.findByIdAndUpdate(id, req.body, { new: true })
        if (!bookToUpdate)
            return res.status(404).send("No book with such id to update")

        return res.status(200).json(bookToUpdate);


    }
    catch (err) {
        res.status(400).json(err)
    }
}



export const addBook = async (req, res) => {

    let { name, numPages } = req.body;
    // if (!name || !numPages)
    //     return res.status(404).send("missing parameters in body : name / num pages")
    let result = validateBook(req.body);
    if (result.error)
        return res.status(400).send(result.error.details[0].message)

    try {
        // let sameBook = await BookModel.find({ $or:[{name: name},{numPages: numPages}] })
        let sameBook = await BookModel.findOne({ name: name, numPages: numPages })
        if (sameBook)
            return res.status(409).send("book with same details already exists")

        let newBook = new BookModel({ ...req.body, userAdded: req.myUser._id });
        await newBook.save()
        return res.status(201).json(newBook)
    }
    catch (err) {
        res.status(400).json(err)
    }

}