/* eslint-disable indent */
/* eslint-disable spaced-comment */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable import/newline-after-import */
/* eslint-disable quotes */
const express = require('express');
const app = express();
const dotenv = require("dotenv");
const logger = require("morgan");
const bodyParser = require("body-parser");
const fs = require("fs");
const apiRoute = require("./routes/mainRoute");




// Configurations
dotenv.config({ path: './config.env' });


const accessLogStream = fs.createWriteStream('./access.log', { flags: 'a' });
app.use(logger(
    "[:date[clf]]       :url        done in :response-time ms", {
    stream: {
        write(str) {
            accessLogStream.write(str);
            console.log(str);
        }
    }
}
));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));






//Route handling middleware
app.use("/api/v1/on-covid-19", apiRoute);








app.all("*", (req, res, next) => {
    next(new Error(`Can not find ${req.originalUrl} on this server!`, 404));
});
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        res.status(400).json({
            status: "failed",
            error: err.message,
            stack: err.stack
        });
    } else if (process.env.NODE_ENV === "production") {
        res.status(400).json({
            status: "failed",
            error: err.message
        });
    }
});






const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
