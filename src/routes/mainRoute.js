
const express = require('express');

const router = express.Router();
const estimateController = require('../controllers/estimateController');


router
  .route('/')
  .get(estimateController.getEstimate)
  .post(estimateController.getData);
router
  .route('/logs')
  .get(estimateController.getLogs)
  .post(estimateController.getLogs);

router
  .route('/:type')
  .get(estimateController.getEstimate)
  .post(estimateController.getData);

module.exports = router;
