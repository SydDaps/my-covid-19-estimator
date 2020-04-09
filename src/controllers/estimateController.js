const Joi = require('@hapi/joi');
const EasyXml = require('easyxml');
const fs = require('fs');
const covid19ImpactEstimator = require('../estimator');

const serializer = new EasyXml({
  singularize: true,
  rootElement: 'response',
  dateFormat: 'ISO',
  manifest: true
});

const data = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  }
};


const validate = (user) => {
  const schema = {
    periodType: Joi.string().required().valid('days', 'weeks', 'months'),
    timeToElapse: Joi.number().required(),
    reportedCases: Joi.number().required(),
    population: Joi.number().required(),
    totalHospitalBeds: Joi.number().required()

  };
  return Joi.validate(user, schema);
};

exports.getEstimate = (req, res, next) => {
  const estimate = covid19ImpactEstimator(data);
  if (req.params.type === 'xml') {
    res.header('Content-Type', 'text/xml');
    const xml = serializer.render(estimate);
    res.send(xml);
  } else if (req.params.type === 'json' || !req.params.type) {
    res.status(200).json({
      status: 'Success',
      estimate
    });
  }
  next(new Error(`Can not find ${req.originalUrl} on this server!`, 404));
};


exports.getData = (req, res, next) => {
  const { error } = validate(req.body);
  if (error) {
    const err = new Error(error.details[0].message);

    return next(err);
  }
  data.periodType = req.body.periodType;
  data.timeToElapse = req.body.timeToElapse;
  data.reportedCases = req.body.reportedCases;
  data.population = req.body.population;
  data.totalHospitalBeds = req.body.totalHospitalBeds;
  res.redirect('/api/v1/on-covid-19');
};

exports.getLogs = (req, res) => {
  fs.readFile('./access.log', 'utf8', (err, dat) => {
    if (err) throw err;
    res.header('Content-Type', 'text/xml');
    res.send(dat);
  });
};
