require("dotenv").config();
const express = require('express');

// import express from "express";
const app = express();
const port = 4000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/twitter', (req, res) => {
    res.send(`www.x.com/amank736836`);
});

app.get('/login', (req, res) => {
    res.send(`<h1>please login before following me 😅</h1>`);
});

app.get('/youtube' , (req,res) => {
    res.send(`www.youtube.com/amank36836`);
});

app.listen(process.env.PORT || port , () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT || port}`);
});