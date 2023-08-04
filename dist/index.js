"use strict";
var _a;
const express = require('express');
const app = express();
const PORT = (_a = process.env['PORT']) !== null && _a !== void 0 ? _a : 3030;
if (process.env['NODE_ENV'] === "production") {
    app.use(express.static("frontend/build"));
    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
