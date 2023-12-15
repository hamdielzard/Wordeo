import React from 'react';

function LetterBox(props) {
  const [letter, setLetter] = React.useState('');
  const [correct, setCorrect] = React.useState(false);

  if (letter === '' && props.letter !== '') {
    setLetter(props.letter);
  }

  if (props.correct != null && props.correct === true && correct === false) {
    setCorrect(true);
  }

  if (props.correct != null && props.correct === false && correct === true) {
    setCorrect(false);
  }

  if (props.letter === '' || props.letter == null) {
    return (
      <div className="letterBox" />
    );
  }

  return (
    <div className={(correct ? 'letterBox correctLetter' : 'letterBox inCorrectLetter')}>
      {letter}
    </div>
  );
}

export default LetterBox;
