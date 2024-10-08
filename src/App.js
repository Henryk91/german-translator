import React, { useState } from 'react';
import './App.css';

const sentences = [
  { en: "Hello, how are you?", de: "Hallo, wie geht es dir?" },
  { en: "What is your name?", de: "Wie heißt du?" },
  { en: "I love learning languages.", de: "Ich liebe es, Sprachen zu lernen." },
  { en: "Where do you live?", de: "Wo wohnst du?" },
  { en: "This is a beautiful day.", de: "Das ist ein schöner Tag." },
];

const App = () => {
  const [currentSentence, setCurrentSentence] = useState(sentences[0]);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  
  const checkTranslation = () => {
    const correctTranslation = currentSentence.de;
    if (userInput.trim().toLowerCase() === correctTranslation.toLowerCase()) {
      const nextSentenceIndex = sentences.indexOf(currentSentence) + 1;
      if (nextSentenceIndex < sentences.length) {
        setCurrentSentence(sentences[nextSentenceIndex]);
        setUserInput("");
        setFeedback("Correct! Here's another sentence.");
      } else {
        setFeedback("Great job! You've completed all sentences.");
      }
    } else {
      const userWords = userInput.split(" ");
      const correctWords = correctTranslation.split(" ");
      const feedbackWords = correctWords.map((word, index) => (
        userWords[index] === word ? word : '___'
      )).join(" ");
      
      if (userInput.trim() === "") {
        setFeedback("You didn't enter any translation. Try again.");
      } else {
        setFeedback(`Incorrect. You got: ${feedbackWords}`);
      }
    }
  };

  return (
    <div className="app">
      <div className="chat-container">
        <ChatBubble text={currentSentence.en} />
        <div className="translation-input">
          <textarea 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your translation here..."
          />
          <button onClick={checkTranslation}>Translate</button>
        </div>
        <div className="feedback">{feedback}</div>
      </div>
    </div>
  );
};

const ChatBubble = ({ text }) => (
  <div className="chat-bubble">
    <p>{text}</p>
  </div>
);

export default App;
