import React, { useState, useEffect, useRef } from 'react';
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
  const [messages, setMessages] = useState([]);
  const [checkPunctuation, setCheckPunctuation] = useState(false); // Set to false by default
  const endOfMessagesRef = useRef(null); // Reference for scrolling

  // Function to check the user's translation
  const checkTranslation = () => {
    const correctTranslation = currentSentence.de;

    // Normalize inputs: trim and lower case
    const normalizedUserInput = userInput.trim().toLowerCase();
    const normalizedCorrectTranslation = correctTranslation.toLowerCase();

    // Remove punctuation from the correct translation if checking is off
    const finalCorrectTranslation = checkPunctuation 
      ? normalizedCorrectTranslation 
      : normalizedCorrectTranslation.replace(/[.,!?]/g, '');

    const finalUserInput = checkPunctuation 
      ? normalizedUserInput 
      : normalizedUserInput.replace(/[.,!?]/g, '');

    // Check if user input matches correct translation (ignoring spaces)
    let feedbackMessage;
    if (finalUserInput === finalCorrectTranslation) {
      const nextSentenceIndex = sentences.indexOf(currentSentence) + 1;
      if (nextSentenceIndex < sentences.length) {
        const nextSentence = sentences[nextSentenceIndex].en;
        setCurrentSentence(sentences[nextSentenceIndex]);
        feedbackMessage = `Correct! Here's another sentence:\n\n${nextSentence}`; // Add extra newline for padding
      } else {
        feedbackMessage = "Great job! You've completed all sentences.";
      }
      setUserInput("");
    } else {
      const userWords = normalizedUserInput.split(" ");
      const correctWords = finalCorrectTranslation.split(" ");
      const feedbackWords = correctWords.map((word, index) => (
        userWords[index] === word ? word : '___'
      )).join(" ");

      if (userInput.trim() === "") {
        feedbackMessage = "You didn't enter any translation. Try again.";
      } else {
        const nextSentence = sentences[sentences.indexOf(currentSentence)].en;
        feedbackMessage = `Incorrect. You got: ${feedbackWords}.\n\nTry again:\n${nextSentence}`; // Add extra newline for padding
      }
    }

    // Add user input and feedback to messages
    setMessages(prevMessages => [
      ...prevMessages,
      { text: `You: ${userInput}`, type: 'user' },
      { text: `Bot: ${feedbackMessage}`, type: 'bot' }
    ]);
    
    // Clear user input for the next translation
    setUserInput("");
  };

  useEffect(() => {
    // Check if there are no previous messages before adding the initial message
    if (messages.length === 0) {
      const initialBotMessage = `Bot: ${currentSentence.en}`;
      setMessages([{ text: initialBotMessage, type: 'bot' }]);
    }
  }, [currentSentence, messages]);

  // Effect to scroll to the bottom of the messages when they change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // Dependency on messages array

  return (
    <div className="app">
      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`chat-bubble ${message.type}`}>
              <p>{message.text.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span> // Break lines into spans
              ))}</p>
            </div>
          ))}
          <div ref={endOfMessagesRef} /> {/* For scrolling */}
        </div>
        {messages.length > 0 && ( // Only show input area if there are messages
          <div className="translation-input">
          <textarea 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your translation here..."
          />
          <div className="button-container"> {/* New wrapper for button and checkbox */}
            <div className="toggle-container">
              <label>
                <input 
                  type="checkbox" 
                  checked={checkPunctuation} 
                  onChange={() => setCheckPunctuation(!checkPunctuation)} 
                />
                Check for punctuation
              </label>
            </div>
            <button 
              onClick={checkTranslation} 
              disabled={!userInput.trim()} // Disable button if input is empty
            >
              Translate
            </button>
          </div>
        </div>
        
        )}
      </div>
    </div>
  );
};

export default App;
