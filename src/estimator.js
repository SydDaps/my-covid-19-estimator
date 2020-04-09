// this calculates and returns the estimate for the Impact of covid_19 for a given data
const calcImpact = (input) => {
  // Number of currently  infected people(i.e general impact) after a given reported case
  const currentlyInfected = input.reportedCases * 10;

  // Estimate for number of infected people(i.e general impact) in days
  let days = input.timeToElapse;
  if (input.periodType === 'weeks') days *= 7;
  else if (input.periodType === 'months') days *= 30;
  const factor = Math.trunc(days / 3);
  const infectionsByRequestedTime = currentlyInfected * (2 ** factor);

  // Estimated number of severe positive cases that will require hospitalization to recover.
  const severeCasesByRequestedTime = 0.15 * infectionsByRequestedTime;

  // Estimated total hospital beds at requested time
  const availableBeds = 0.35 * input.totalHospitalBeds;
  const hospitalBedsByRequestedTime = availableBeds - severeCasesByRequestedTime;

  // Estimated number of severe positive cases(severe impact) that will require ICU care.
  const casesForICUByRequestedTime = 0.05 * infectionsByRequestedTime;

  // //Estimated number of severe positive cases(severe impact) that will require ICU care.
  const casesForVentilatorsByRequestedTime = 0.02 * infectionsByRequestedTime;

  // Estimate loss in economy (i.e general impact)
  const inPopu = infectionsByRequestedTime * input.region.avgDailyIncomePopulation;
  const dollarsInFlight = inPopu * input.region.avgDailyIncomeInUSD * days;


  const impactObj = {
    currentlyInfected: Math.trunc(currentlyInfected),
    infectionsByRequestedTime: Math.trunc(infectionsByRequestedTime),
    severeCasesByRequestedTime: Math.trunc(severeCasesByRequestedTime),
    hospitalBedsByRequestedTime: Math.trunc(hospitalBedsByRequestedTime),
    casesForICUByRequestedTime: Math.trunc(casesForICUByRequestedTime),
    casesForVentilatorsByRequestedTime: Math.trunc(casesForVentilatorsByRequestedTime),
    dollarsInFlight: parseFloat(dollarsInFlight.toFixed(2))
  };
  return impactObj;
};


// this calculates and returns the severe estimate estimate for the Impact of covid_19
const calcSevereImpact = (input) => {
  // Number of currently infected people(severe impact) after a given reported case
  const currentlyInfected = input.reportedCases * 50;

  // Estimate for number of infected(severe impact) people in days
  let days = input.timeToElapse;
  if (input.periodType === 'weeks') days *= 7;
  else if (input.periodType === 'months') days *= 30;
  const factor = Math.trunc(days / 3);
  const infectionsByRequestedTime = currentlyInfected * (2 ** factor);

  // Estimated number of severe positive cases that will require hospitalization to recover.
  const severeCasesByRequestedTime = 0.15 * infectionsByRequestedTime;

  // Estimated total hospital beds at requested time
  const availableBeds = 0.35 * input.totalHospitalBeds;
  const hospitalBedsByRequestedTime = availableBeds - severeCasesByRequestedTime;

  // Estimated number of severe positive cases(severe impact) that will require ICU care.
  const casesForICUByRequestedTime = 0.05 * infectionsByRequestedTime;

  // //Estimated number of severe positive cases(severe impact) that will require ICU care.
  const casesForVentilatorsByRequestedTime = 0.02 * infectionsByRequestedTime;

  // Estimate loss in economy (i.e general impact)

  const inPopu = infectionsByRequestedTime * input.region.avgDailyIncomePopulation;
  const dollarsInFlight = inPopu * input.region.avgDailyIncomeInUSD * days;

  const severeImpactObj = {
    currentlyInfected: Math.trunc(currentlyInfected),
    infectionsByRequestedTime: Math.trunc(infectionsByRequestedTime),
    severeCasesByRequestedTime: Math.trunc(severeCasesByRequestedTime),
    hospitalBedsByRequestedTime: Math.trunc(hospitalBedsByRequestedTime),
    casesForICUByRequestedTime: Math.trunc(casesForICUByRequestedTime),
    casesForVentilatorsByRequestedTime: Math.trunc(casesForVentilatorsByRequestedTime),
    dollarsInFlight: parseFloat(dollarsInFlight.toFixed(2))
  };
  return severeImpactObj;
};
const covid19ImpactEstimator = (data) => {
  const estimateObj = {
    data,
    impact: calcImpact(data),
    severeImpact: calcSevereImpact(data)

  };
  return estimateObj;
};

module.exports = covid19ImpactEstimator;
// export default covid19ImpactEstimator;
// console.log(covid19ImpactEstimator(rawData));
