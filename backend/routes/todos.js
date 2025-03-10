const express = require('express');
const Todo = require('../models/Todo');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    }catch (error){
        res.status(500).json({ message : error.message});
    }
});

router.post('/', async (req, res) => {
    const todo = new Todo({
        name: req.body.name, //make sure this matches your schema
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (error){
        res.status(400).json({ message: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                completed: req.body.completed
            },
            { new: true }
        );
        res.json(updatedTodo);
    } catch (error){
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;