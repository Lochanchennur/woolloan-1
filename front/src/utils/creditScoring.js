// creditScoring.js
// Utility to process Kaggle credit scoring datasets and extract metrics for thin-file users.

export const processCreditData = (data) => {
  if (!data || data.length === 0) return null;

  let totalUsers = data.length;
  let thinFileCount = 0;
  let totalCreditScore = 0;
  let defaultCount = 0;

  // Chart data aggregates
  let ageDistribution = { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '55+': 0 };
  let creditCardCounts = { '0-1 Cards': 0, '2-3 Cards': 0, '4+ Cards': 0 };
  
  // Clean column names to make it case-insensitive and handle spaces
  const sampleRow = data[0];
  const colMap = {};
  Object.keys(sampleRow).forEach(key => {
    colMap[key.toLowerCase().replace(/[^a-z0-9]/g, '')] = key;
  });

  const getVal = (row, possibleNames) => {
    for (const name of possibleNames) {
      if (colMap[name]) return row[colMap[name]];
    }
    return undefined;
  };

  data.forEach(row => {
    // Attempt to extract typical Kaggle columns
    const age = parseInt(getVal(row, ['age', 'customerage'])) || 30;
    const numCards = parseInt(getVal(row, ['numcreditcard', 'numberofcreditcards'])) || 0;
    const creditHistoryAge = getVal(row, ['credithistoryage', 'historyage']); // string or number
    const score = parseInt(getVal(row, ['creditscore'])) || 0;
    const isDefault = getVal(row, ['default', 'paymentofminamount', 'target', 'risk']) === 'Yes' || getVal(row, ['default']) === 1;

    // Thin file heuristic: 0-1 credit cards or short history
    let isThinFile = false;
    if (numCards <= 1) isThinFile = true;
    if (typeof creditHistoryAge === 'string' && creditHistoryAge.includes('Years')) {
       const years = parseInt(creditHistoryAge.split(' ')[0]);
       if (years < 2) isThinFile = true;
    }

    if (isThinFile) thinFileCount++;
    if (score > 0) totalCreditScore += score;
    if (isDefault) defaultCount++;

    // Age distribution
    if (age <= 25) ageDistribution['18-25']++;
    else if (age <= 35) ageDistribution['26-35']++;
    else if (age <= 45) ageDistribution['36-45']++;
    else if (age <= 55) ageDistribution['46-55']++;
    else ageDistribution['55+']++;

    // Cards distribution
    if (numCards <= 1) creditCardCounts['0-1 Cards']++;
    else if (numCards <= 3) creditCardCounts['2-3 Cards']++;
    else creditCardCounts['4+ Cards']++;
  });

  const ageData = Object.keys(ageDistribution).map(key => ({
    name: key,
    value: ageDistribution[key]
  }));

  const cardData = Object.keys(creditCardCounts).map(key => ({
    name: key,
    value: creditCardCounts[key]
  }));

  return {
    totalUsers,
    thinFileCount,
    thinFilePercent: ((thinFileCount / totalUsers) * 100).toFixed(1),
    avgCreditScore: totalCreditScore > 0 ? Math.round(totalCreditScore / totalUsers) : 'N/A',
    defaultRate: ((defaultCount / totalUsers) * 100).toFixed(1),
    charts: {
      ageData,
      cardData
    },
    raw: data // Keep raw data for comparison logic
  };
};

export const evaluateSingleApplicant = (applicant, dataset) => {
  // Extract numerical values safely
  const reqAmount = parseFloat(applicant.loanAmount) || 0;
  const income = parseFloat(applicant.annualIncome) || 0;
  const age = parseInt(applicant.age) || 30;
  const numCards = parseInt(applicant.numCards) || 0;
  
  const dti = income > 0 ? ((reqAmount / 12) / (income / 12)) * 100 : 100; // Mock DTI 
  
  let riskScore = 50; // Starting baseline
  let factors = [];
  
  if (dti > 40) {
    riskScore += 25;
    factors.push({ type: 'danger', message: `High Debt-to-Income Request (${dti.toFixed(1)}%)` });
  } else {
    riskScore -= 10;
    factors.push({ type: 'success', message: `Healthy Debt-to-Income Request (${dti.toFixed(1)}%)` });
  }

  if (numCards <= 1) {
    riskScore += 15;
    factors.push({ type: 'warning', message: `Thin-File Warning: Very limited credit lines.` });
  } else {
    riskScore -= 5;
    factors.push({ type: 'success', message: `Adequate active credit lines.` });
  }

  if (age < 25) {
    riskScore += 5;
    factors.push({ type: 'warning', message: `Younger demographic statistically correlates slightly higher risk.` });
  }

  // Ensure bounds
  riskScore = Math.max(0, Math.min(100, riskScore));

  let recommendation = 'Review Required';
  if (riskScore < 30) recommendation = 'Highly Likely to Approve';
  else if (riskScore < 60) recommendation = 'Potential to Approve (Manual Review)';
  else recommendation = 'High Risk - Likely Reject';

  return {
    riskScore,
    recommendation,
    factors,
    dti: dti.toFixed(1)
  };
};
