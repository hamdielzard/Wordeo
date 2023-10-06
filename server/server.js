const express = require('express');
const app = express();

const port = 8080;

app.get("/", (req, res) => {
    res.json({"version": "V1"});
});

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});