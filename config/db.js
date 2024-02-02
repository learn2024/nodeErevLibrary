import mongoose from "mongoose";

export const connectToDB = () => {

    let uri = process.env.DB_URI || "mongodb://0.0.0.0:27017/libraryErev";
    mongoose.connect(uri)
        .then(suc => {
            console.log("mongoDB connected" +suc.connection.host);

        })
        .catch(err => {
            console.log("cannot connect mongDb");
            console.log(err)
            process.exit(1);
        })
}