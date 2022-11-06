const express = require("express");
const mongoose = require("mongoose");
const authCheck = require("../middleware/authCheck");
const Todo = require("../Modal/todoModal");

const router = express.Router();

router.get("/", authCheck, async (req, res) => {
    try {
        const allTodos = await Todo.find({ userId: req.user._id })
            .populate(
                "userId",
                "-password"
            );
        if (allTodos.length === 0) {
            return res.status(200).send("Hi add todos to see")
        }
        else {
            return res.status(200).json(allTodos[0].todo);
        }
    } catch (err) {
        console.log(err);
    }
});

router.post("/addtodo", authCheck, async (req, res) => {
    // console.log(req.user._id)
    try {
        const todoList = await Todo.find({ userId: req.user._id });
        if (todoList.length) {
            var savedTodo = await Todo.updateMany({ userId: req.user._id }, {
                $push: { todo: req.body }
            })

            const list = await Todo.find({ userId: req.user._id });
            let newlist = list[0].todo;
            const newArr = newlist.map((item) => {
                const newObj = Object.assign({}, item, {
                    hiWorld: `${item.activity}`,
                });
                return newObj;
            });
            var uniqueItems = [];
            var duplicateIds = [];
            newArr.forEach((item) => {
                if (uniqueItems.includes(item.hiWorld)) {
                    duplicateIds.push(item._doc._id);
                } else {
                    uniqueItems.push(item.hiWorld);
                    uniqueItems.push(item._doc._id);
                }
            });

            let updated = await Todo.updateMany({ userId: req.user._id }, { $pull: { todo: { _id: [...duplicateIds] } } }, { multi: true })
        }
        else {
            var savedTodo = await Todo.create({
                todo: req.body,
                userId: req.user._id
            });

            const list = await Todo.find({ userId: req.user._id });

            let newlist = list[0].todo;
            const newArr = newlist.map((item) => {
                const newObj = Object.assign({}, item, {
                    hiWorld: `${item.activity}`,
                });
                return newObj;
            });
            var uniqueItems = [];
            var duplicateIds = [];
            newArr.forEach((item) => {
                if (uniqueItems.includes(item.hiWorld)) {
                    duplicateIds.push(item._doc._id);
                } else {
                    uniqueItems.push(item.hiWorld);
                    uniqueItems.push(item._doc._id);
                }
            });

            let updated = await Todo.updateMany({ userId: req.user._id }, { $pull: { todo: { _id: [...duplicateIds] } } }, { multi: true })
        }

        let finalList = await Todo.find({ userId: req.user._id })

        res.status(200).send(finalList[0].todo)
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;
