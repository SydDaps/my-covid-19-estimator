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

let data = { region: {} };


const validate = (val) => {
  const schema = {
    name: Joi.string().required(),
    avgAge: Joi.number().required(),
    avgDailyIncomeInUSD: Joi.number().required(),
    avgDailyIncomePopulation: Joi.number().required(),
    periodType: Joi.string().required().valid('days', 'weeks', 'months'),
    timeToElapse: Joi.number().required(),
    reportedCases: Joi.number().required(),
    population: Joi.number().required(),
    totalHospitalBeds: Joi.number().required()

  };
  return Joi.validate(val, schema);
};
const validateObj = (val) => {
  const schema = {
    region: Joi.object({
      name: Joi.string().required(),
      avgAge: Joi.number().required(),
      avgDailyIncomeInUSD: Joi.number().required(),
      avgDailyIncomePopulation: Joi.number().required()
    }),
    periodType: Joi.string().required().valid('days', 'weeks', 'months'),
    timeToElapse: Joi.number().required(),
    reportedCases: Joi.number().required(),
    population: Joi.number().required(),
    totalHospitalBeds: Joi.number().required()

  };
  return Joi.validate(val, schema);
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
  } else {
    next(new Error(`Can not find ${req.originalUrl} on this server!`, 404));
  }
};


exports.getData = (req, res, next) => {
  // const url = req.originalUrl;
  if (req.body.name) {
    const { error } = validate(req.body);
    if (error) {
      const err = new Error(error.details[0].message);
      return next(err);
    }
    data.region.name = req.body.name;
    data.region.avgAge = req.body.avgAge;
    data.region.avgDailyIncomeInUSD = req.body.avgDailyIncomeInUSD;
    data.region.avgDailyIncomePopulation = req.body.avgDailyIncomePopulation;
    data.periodType = req.body.periodType;
    data.timeToElapse = req.body.timeToElapse;
    data.reportedCases = req.body.reportedCases;
    data.population = req.body.population;
    data.totalHospitalBeds = req.body.totalHospitalBeds;
    // res.redirect(url);
  } else {
    const { error } = validateObj(req.body);
    if (error) {
      const err = new Error(error.details[0].message);
      return next(err);
    }
    data = req.body;
    // res.redirect(url);
  }
  const estimate = covid19ImpactEstimator(data);
  if (req.params.type === 'xml') {
    res.header('Content-Type', 'text/xml');
    const xml = serializer.render(estimate);
    return res.send(xml);
  } if (req.params.type === 'json' || !req.params.type) {
    return res.status(200).json({
      status: 'Success',
      estimate
    });
  }
  return next(new Error(`Can not find ${req.originalUrl} on this server!`));
};

exports.getLogs = (req, res) => {
  fs.readFile('./src/access.log', 'utf8', (err, dat) => {
    if (err) throw err;
    res.header('Content-Type', 'text/xml');
    res.send(dat);
  });
};
