/* eslint-disable no-multiple-empty-lines */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable import/newline-after-import */
const express = require("express");
const router = express.Router();
const estimateController = require("../controllers/estimateController");



router
    .route("/")
    .get(estimateController.getEstimate)
    .post(estimateController.getData);
router
    .route("/logs")
    .get(estimateController.getLogs);

router
    .route("/:type")
    .get(estimateController.getEstimate);




module.exports = router;
