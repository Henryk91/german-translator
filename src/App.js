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
  const [shuffleQuestions, setShuffleQuestions] = useState(false); // New state for shuffling
  const endOfMessagesRef = useRef(null); // Reference for scrolling

  // Shuffle the sentences array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Update current sentence and shuffle if needed
  const updateCurrentSentence = () => {
    if (shuffleQuestions) {
      const shuffledSentences = shuffleArray([...sentences]);
      return shuffledSentences[0]; // Return a new random sentence
    }
    return sentences[Math.floor(Math.random() * sentences.length)]; // Return a random sentence if shuffle is off
  };

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
      const nextSentence = updateCurrentSentence(); // Get the next sentence based on shuffle
      setCurrentSentence(nextSentence);
      feedbackMessage = `Correct! Here's another sentence:\n\n${nextSentence.en}`; // Add extra newline for padding
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
        feedbackMessage = `Incorrect. You got: ${feedbackWords}.\n\nTry again:\n${currentSentence.en}`; // Add extra newline for padding
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

  // Function to show the correct translation and move to the next sentence
  const showCorrectAnswer = () => {
    const correctAnswerMessage = `The correct answer is: ${currentSentence.de}\n\nHere's another sentence:\n\n${updateCurrentSentence().en}`;
    
    setMessages(prevMessages => [
      ...prevMessages,
      { text: `You: ${userInput}`, type: 'user' },
      { text: `Bot: ${correctAnswerMessage}`, type: 'bot' }
    ]);

    // Update current sentence
    setCurrentSentence(updateCurrentSentence());
    setUserInput(""); // Clear input for the next translation
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

  // Handle key down event in textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && userInput.trim()) { // Check for Enter key only if input is not empty
      e.preventDefault(); // Prevent adding a new line
      checkTranslation(); // Trigger the translation check
    }
  };

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
              onKeyDown={handleKeyDown} // Add key down handler
            />
            <div className="button-container"> {/* Wrapper for button and checkbox */}
              <div className="toggle-container">
                <label>
                  <input 
                    type="checkbox" 
                    checked={checkPunctuation} 
                    onChange={() => setCheckPunctuation(!checkPunctuation)} 
                  />
                  Check for punctuation
                </label>
                <label style={{ marginLeft: '10px' }}>
                  <input 
                    type="checkbox" 
                    checked={shuffleQuestions} 
                    onChange={() => setShuffleQuestions(!shuffleQuestions)} 
                  />
                  Shuffle Questions
                </label>
              </div>
              <button 
                onClick={checkTranslation} 
                disabled={!userInput.trim() && messages.length > 0} // Disable button if input is empty only during translation
              >
                Translate
              </button>
              <button 
                onClick={showCorrectAnswer} 
                style={{ marginLeft: '10px' }} // Add space between buttons
              >
                Show Answer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
