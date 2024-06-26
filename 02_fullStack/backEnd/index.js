// require("dotenv").config();
// const express = require('express');
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';

const app = express();

// Get __dirname equivalent in ES module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Serve static files from the 'dist' directory
app.use(express.static('.'));

// app.get('/', (req, res) => {
//     res.send(`${__filename + ' ' + __dirname}`);
// });



// get a list of 5 jokes

app.get('/api/jokes', (req, res) => {
    const jokes = [
        {
            id: 1,
            question: 'What is the best thing about Switzerland?',
            answer: 'I do not know, but the flag is a big plus'
        },
        {
            id: 2,
            question: 'Did you hear about the mathematician who is afraid of negative numbers?',
            answer: 'He will stop at nothing to avoid them'
        },
        {
            id: 3,
            question: 'Why do we tell actors to break a leg?',
            answer: 'Because every play has a cast'
        },
        {
            id: 4,
            question: 'Helvetica and Times New Roman walk into a bar',
            answer: 'Get out! shouts the bartender. We do not serve your type'
        },
        {
            id: 5,
            question: 'How many programmers does it take to change a light bulb?',
            answer: 'None. That is a hardware problem'
        }
    ];
    res.send(jokes);
});

const port = process.env.PORT2 || 4000;

app.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`);
});