import React from "react";

function SentenceAnalysis(props) {
  const { detectionResults } = props;
  const { info = {} } = detectionResults;

  return (
    <div>
      <p>Word Count: {info.word || 0}</p>
      <p>Letter Count: {info.letter || 0}</p>
      <p>Vowel Count: {info.vowels || 0}</p>
      <p>Consonant Count: {info.consonants || 0}</p>
      <p>Symbol Count: {info.symbols || 0}</p>
      <p>Turkish Character Count: {info.turkish || 0}</p>
    </div>
  );
}

export default SentenceAnalysis;
