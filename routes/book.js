import express from "express";

import { addBook, deleteBook, getAllBooks, getBookById, updateBook } from "../controllers/book.js"
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllBooks)
//http://localhost:3500/api/book?txt=מנוחה&perPage=20&page=3

router.get("/:id", getBookById)

router.post("/", auth, addBook)

router.delete("/:id",auth, deleteBook)

router.put("/:id",auth, updateBook)


export default router;

// /api/book /: id

// localhost: 3500 / api / book / 3

//     / api / book /
//     localhost: 3500 / api / book ? txt = abc
