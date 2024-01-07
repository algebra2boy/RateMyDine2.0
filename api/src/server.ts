import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.status(201).json({ message: "hello" });
})

app.listen(3000, () => {
    console.log("the server is running on localhost:3000");
});