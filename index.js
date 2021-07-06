const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./src/routes/auth")
const usersRoute = require("./src/routes/users");
const postsRoute = require("./src/routes/posts");
const categoriesRoute = require("./src/routes/categories");
const multer = require("multer");
const path = require("path");

dotenv.config();

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "./src/images")));

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
}).then(console.log("conected to mongoDB")).catch((err) => console.log(err));

const storage = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, "./src/images")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    }
})

const upload = multer({storage:storage})
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded")
})

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute)
app.use("/api/posts", postsRoute)
app.use("/api/categories", categoriesRoute);

app.listen("5000", () => {
    console.log("Backend is running");
});
