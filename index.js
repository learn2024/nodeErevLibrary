import express from "express";
import bookRouter from "./routes/book.js"
import userRouter from "./routes/user.js"
import cors from "cors";
//ייבאנו מעמוד אחר משהו שייצאנו בדיפולט ולכן כאן מותר לקרוא לו באיזה שם שרוצים

import { connectToDB } from "./config/db.js";
import { config } from "dotenv";
import { errorHandling } from "./middlewares/errorHandking.js";


config();//גורם שאת המשתני סביבה יקחו מהקובץ .env
const app = express();

app.use(express.json())

app.use(cors())

connectToDB();

app.use("/api/book", bookRouter);
app.use("/api/user", userRouter);



app.use(errorHandling)

let port = process.env.PORT || 3500;

app.listen(port, () => {
    console.log("app is litening " + port)
})


