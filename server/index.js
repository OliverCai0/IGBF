import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import userRouter from "./routes/user.js"

const app = express();

app.use(morgan("dev"));
app.use(express.json({limit: "30mb", extended: true}));
app.use(express.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

app.use("/users", userRouter); // http://localhost:6000/users/signup

const MONGODB_URL = "mongodb+srv://IGBF:eNK8Gt9Z33ML3ctO@cluster0.fjswv.mongodb.net/user_db?retryWrites=true&w=majority"

const port = process.env.port || 6000;

mongoose.connect(MONGODB_URL)
    .then(() => {
        app.listen(port, () => console.log(`Server is running on port ${port}`));
    })
    .catch((error) => console.log(`${error} did not connect`));