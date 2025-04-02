const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = "mongodb+srv://aswin_murali:Aswinmurali@cluster0.4xrsk.mongodb.net/todoDB?retryWrites=true&w=majority";
mongoose.connect(mongoURI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => {
      console.error("Database connection error:", err);
      process.exit(1); // Exit process if DB fails
  });

// Define Schema & Model
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    dueDate: { type: Date, required: false },
    priority: { type: String, enum: ['low', 'medium', 'high'], required: false },
    completed: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

// API Routes
app.post("/api/todos", async (req, res) => {
    try {
        console.log("Received new task:", req.body);
        const newTodo = new Todo(req.body);
        const savedTodo = await newTodo.save();
        console.log("Saved task:", savedTodo);
        res.status(201).json(savedTodo);
    } catch (error) {
        console.error("Error saving task:", error);
        res.status(400).json({ error: error.message });
    }
});

app.get("/api/todos", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/api/todos/:id", async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTodo) return res.status(404).json({ error: "Todo not found" });
        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete("/api/todos/:id", async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) return res.status(404).json({ error: "Todo not found" });
        res.status(200).json({ message: "Todo deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
