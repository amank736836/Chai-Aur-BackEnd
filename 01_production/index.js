import dotenv from 'dotenv';
// require("dotenv").config();
// const express = require('express');

dotenv.config();

import express from "express";
const app = express();

// const port = 4000;
const port = process.env.PORT || 4000;
const githubData = {
    "login": "amank736836",
    "id": 144197075,
    "node_id": "U_kgDOCJhF0w",
    "avatar_url": "https://avatars.githubusercontent.com/u/144197075?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/amank736836",
    "html_url": "https://github.com/amank736836",
    "followers_url": "https://api.github.com/users/amank736836/followers",
    "following_url": "https://api.github.com/users/amank736836/following{/other_user}",
    "gists_url": "https://api.github.com/users/amank736836/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/amank736836/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/amank736836/subscriptions",
    "organizations_url": "https://api.github.com/users/amank736836/orgs",
    "repos_url": "https://api.github.com/users/amank736836/repos",
    "events_url": "https://api.github.com/users/amank736836/events{/privacy}",
    "received_events_url": "https://api.github.com/users/amank736836/received_events",
    "type": "User",
    "site_admin": false,
    "name": "Aman Kumar",
    "company": null,
    "blog": "https://linktr.ee/amank736836",
    "location": "Chandigarh",
    "email": null,
    "hireable": true,
    "bio": "👋 CS student | Coding enthusiast | Python, C++, Java | Let's build cool stuff together! 🚀",
    "twitter_username": "amank736836",
    "public_repos": 26,
    "public_gists": 0,
    "followers": 0,
    "following": 0,
    "created_at": "2023-09-06T03:26:49Z",
    "updated_at": "2024-06-03T13:24:22Z"
};


app.get('/', (req, res) => {
    res.send(`Hello World! , running on port ${port}`);
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

app.get('/github', (req, res) => {
    res.json(githubData);
});

app.listen(port , () => {
    console.log(`Example app listening at http://localhost:${port}`);
});