/**
 * Created by jeanpierre on 15/02/17.
 */

const express = require('express');

const User = require('../models/User');
const Todo = require('../models/Todo');

const authMiddleware = require('../auth/middleware');

module.exports = function(router) {
    'use strict';

    router.use('/', authMiddleware);

    router.route('/')
        .get(async function(req, res, next) {
            let results;
            try {
                results = await Todo.find({user_id: req.body.user.id});
            } catch (e) {
                throw e;
            }
            res.json({message: results});
        })
        .post(async function (req, res, next) {
            let todo = new Todo();
            todo.user_id = req.body.user.id;
            todo.todo = req.body.todo;
            todo.done = false;
            todo.date_created = new Date().toString();
            todo.date_done = "";

            await todo.save();

            res.status(201).json({message: todo});
        });

    router.param('todo_id', async function(req, res, next, id) {
        let todo = await Todo.findOne({_id: id, user_id: req.body.user.id});
        if(!todo)
            return res.status(404).json({error: "Todo not found."});
        req.todo = todo;
        next();
    });

    router.route('/:todo_id')
        .get(function (req, res, next) {
            res.json({message: req.todo});
        })
        .patch(async function (req, res, next) {
            let todo = req.todo;
            todo.todo = req.body.todo;
            await todo.save();
            res.json({message: todo});
        })
        .delete(async function (req, res, next) {
            let todo = req.todo;
            await Todo.remove(todo);
            return res.json({message: "Success."})
        });

    router.route('/:todo_id/do')
        .post(async function (req, res, next) {
            let todo = req.todo;

            if(todo.done)
                return res.json({error: "Todo is already done."});

            todo.done = true;
            todo.date_done = new Date().toString();

            await todo.save();
            res.json({message: todo});
        });
    router.route('/:todo_id/undo')
        .post(async function (req, res, next) {
            let todo = req.todo;

            if(!todo.done)
                return res.json({error: "Todo is not done yet."});

            todo.done = false;
            todo.date_done = "";

            await todo.save();
            res.json({message: todo});
        });

};