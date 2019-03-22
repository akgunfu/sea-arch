export const CHARACTERS = {
  EMPTY: "",
  WHITESPACE: " ",
  PLUS: "+",
  COMMA: ",",
  PERIOD: ".",
  HYPHEN: "-",
  UNDERSCORE: "_"
};

export const INSIGNIFICANT = 0.00001;

export const CHOICES = {
  A: "a",
  B: "b",
  C: "c"
};

export const split = (words, filter = 1, char = CHARACTERS.WHITESPACE) =>
  words.split(char).filter(token => token.length > filter);

export const max = (inputs = []) =>
  inputs.reduce((max, n) => (n > max ? n : max), 0);

export const normalize = word =>
  CHARACTERS.WHITESPACE + word.toLocaleLowerCase();

export const getTextPrediction = (
  text,
  textInfo,
  keywordsA,
  keywordsB,
  keywordsC
) => {
  const words = text.split(CHARACTERS.WHITESPACE);
  const tokenSize = words.length;

  const highlightIndexA = checkMatch(words, keywordsA);
  const highlightIndexB = checkMatch(words, keywordsB);
  const highlightIndexC = checkMatch(words, keywordsC);
  const deviationA = findDeviation(highlightIndexA);
  const deviationB = findDeviation(highlightIndexB);
  const deviationC = findDeviation(highlightIndexC);
  const longestA = findLongest(highlightIndexA);
  const longestB = findLongest(highlightIndexB);
  const longestC = findLongest(highlightIndexC);
  const matchA = highlightIndexA.length;
  const matchB = highlightIndexB.length;
  const matchC = highlightIndexC.length;

  const getLongest = _key => {
    switch (_key) {
      case CHOICES.A:
        return longestA;
      case CHOICES.B:
        return longestB;
      case CHOICES.C:
        return longestC;
      default:
        return max([longestA, longestB, longestC]);
    }
  };

  const getMatch = _key => {
    switch (_key) {
      case CHOICES.A:
        return matchA;
      case CHOICES.B:
        return matchB;
      case CHOICES.C:
        return matchC;
      default:
        return max([matchA, matchB, matchC]);
    }
  };

  const penalty = _key => {
    const globalLongest = getLongest();
    const globalMatch = getMatch();
    const keyLongest = getLongest(_key);
    const keyMatch = getMatch(_key);

    const distance =
      (Math.abs(globalLongest - keyLongest) + 1) *
      (Math.abs(globalMatch - keyMatch) + 1);
    return distance * distance;
  };

  textInfo.push({
    all: tokenSize,
    globalLongest: getLongest(),
    globalMatch: getMatch(),
    indicesA: highlightIndexA,
    indicesB: highlightIndexB,
    indicesC: highlightIndexC,
    deviationA,
    deviationB,
    deviationC,
    penaltyA: penalty(CHOICES.A),
    penaltyB: penalty(CHOICES.B),
    penaltyC: penalty(CHOICES.C),
    longestA,
    longestB,
    longestC,
    matchA,
    matchB,
    matchC,
    calculationA:
      (longestA * longestA * (matchA - 1)) /
      (penalty(CHOICES.A) * Math.sqrt((tokenSize - matchA) * deviationA) + 1),
    calculationB:
      (longestB * longestB * (matchB - 1)) /
      (penalty(CHOICES.B) * Math.sqrt((tokenSize - matchB) * deviationB) + 1),
    calculationC:
      (longestC * longestC * (matchC - 1)) /
      (penalty(CHOICES.C) * Math.sqrt((tokenSize - matchC) * deviationC) + 1)
  });
};

// Calculates final results from per text result
export const getFinalCalculation = (info, results) => {
  let calc = {};
  const calculationsA = Object.values(info)
    .map(i => i.textInfo.map(t => t.calculationA))
    .flat();
  const countResultsA = (info.a || {}).result || 0;
  let occurrenceA =
    calculationsA.reduce((a = 0, b = 0) => a + b, 0) /
    (calculationsA.length + INSIGNIFICANT);
  const calculationsB = Object.values(info)
    .map(i => i.textInfo.map(t => t.calculationB))
    .flat();
  const countResultsB = (info.b || {}).result || 0;
  let occurrenceB =
    calculationsB.reduce((a = 0, b = 0) => a + b, 0) /
    (calculationsB.length + INSIGNIFICANT);
  const calculationsC = Object.values(info)
    .map(i => i.textInfo.map(t => t.calculationC))
    .flat();
  const countResultsC = (info.c || {}).result || 0;
  let occurrenceC =
    calculationsC.reduce((a = 0, b = 0) => a + b, 0) /
    (calculationsC.length + INSIGNIFICANT);

  const occurrenceTotal =
    occurrenceA + occurrenceB + occurrenceC + INSIGNIFICANT;

  occurrenceA = (100 * occurrenceA) / occurrenceTotal;
  occurrenceB = (100 * occurrenceB) / occurrenceTotal;
  occurrenceC = (100 * occurrenceC) / occurrenceTotal;

  calc.a = {
    occurrence: occurrenceA,
    searchRatio: countResultsA,
    mixed: 0.9 * occurrenceA + 0.1 * countResultsA
  };

  calc.b = {
    occurrence: occurrenceB,
    searchRatio: countResultsB,
    mixed: 0.9 * occurrenceB + 0.1 * countResultsB
  };

  calc.c = {
    occurrence: occurrenceC,
    searchRatio: countResultsC,
    mixed: 0.9 * occurrenceC + 0.1 * countResultsC
  };

  return calc;
};

// Returns indices of matching words
const checkMatch = (words, keywords) => {
  let highlightIndex = [];
  words.forEach((word, i) => {
    keywords.forEach(keyword => {
      if (normalize(word).includes(normalize(keyword))) {
        highlightIndex.push(i);
      }
    });
  });

  return [...new Set(highlightIndex)];
};

// Mean function
const findMean = (indices = []) => {
  if (indices.length === 0) {
    return 0;
  }
  if (indices.length % 2 === 1) {
    return indices[Math.floor(indices.length / 2) + 1];
  }
  return (indices[indices.length / 2 - 1] + indices[indices.length / 2]) / 2;
};

// Standard Deviation of match indices
const findDeviation = (indices = []) => {
  if (indices.length < 2) {
    return 1;
  }

  const mean = findMean(indices);
  const sqrt_sum = indices
    .map(x => (x - mean) * (x - mean))
    .reduce((a, b) => a + b, 0);
  return Math.sqrt(sqrt_sum / (indices.length - 1));
};

// Longest matching sequence in the text
const findLongest = (indices = []) => {
  if (indices.length < 1) {
    return 0;
  }

  let longest = 1;
  let match = 1;
  indices.forEach((index, i) => {
    if (indices.length >= i + 1) {
      if (index + 1 === indices[i + 1]) {
        match = match + 1;
        if (match > longest) {
          longest = match;
        }
      } else {
        match = 1;
      }
    }
  });

  return longest;
};
