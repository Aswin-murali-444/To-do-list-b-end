const express = require("express");
const router = express.Router();
const Todo = require("../models/todo");

router.post("/", async (req, res) => {
    try {
        const newTodo = new Todo(req.body);
        await newTodo.save();
        res.status(201).json({ message: "Todo created successfully!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json({ todos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;