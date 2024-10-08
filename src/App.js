import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const initialSentences = [
  { en: "Hello, how are you?", de: "Hallo, wie geht es dir?" },
  { en: "What is your name?", de: "Wie heißt du?" },
  { en: "I love learning languages.", de: "Ich liebe es, Sprachen zu lernen." },
  { en: "Where do you live?", de: "Wo wohnst du?" },
  { en: "This is a beautiful day.", de: "Das ist ein schöner Tag." },
];

const App = () => {
  const [sentences, setSentences] = useState(initialSentences);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [checkPunctuation, setCheckPunctuation] = useState(false);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const endOfMessagesRef = useRef(null);

  // Shuffle the sentences array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Function to update the current sentence
  const updateCurrentSentence = () => {
    return sentences[currentSentenceIndex];
  };

  // Function to check the user's translation
  const checkTranslation = () => {
    const currentSentence = updateCurrentSentence();
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
      const nextSentenceIndex = currentSentenceIndex + 1; 
      if (nextSentenceIndex < sentences.length) {
        setCurrentSentenceIndex(nextSentenceIndex);
        const nextSentence = sentences[nextSentenceIndex].en;
        feedbackMessage = `Correct! Here's another sentence:\n\n${nextSentence}`; 
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
        feedbackMessage = `Incorrect. You got: ${feedbackWords}.\n\nTry again:\n${currentSentence.en}`; 
      }
    }

    // Add user input and feedback to messages
    setMessages(prevMessages => [
      ...prevMessages,
      { text: `You: ${userInput}`, type: 'user' },
      { text: `Bot: ${feedbackMessage}`, type: 'bot' }
    ]);
    
    setUserInput("");
  };

  // Function to show the correct translation and move to the next sentence
  const showCorrectAnswer = () => {
    const currentSentence = updateCurrentSentence(); 
    const correctAnswerMessage = `The correct answer is: ${currentSentence.de}\n\nHere's another sentence:\n\n${sentences[currentSentenceIndex + 1]?.en || "No more sentences available."}`; 
    
    // Add user input and feedback to messages
    setMessages(prevMessages => [
      ...prevMessages,
      { text: `You: Show Answer please`, type: 'user' },
      { text: `Bot: ${correctAnswerMessage}`, type: 'bot' }
    ]);

    // Update current sentence
    setCurrentSentenceIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      if (nextIndex < sentences.length) {
        return nextIndex; 
      }
      return prevIndex; 
    });
    setUserInput(""); 
  };

  useEffect(() => {
    // Shuffle sentences if required
    if (shuffleQuestions) {
      const shuffledSentences = shuffleArray([...initialSentences]); 
      setSentences(shuffledSentences);
      setCurrentSentenceIndex(0); 
    } else {
      setSentences(initialSentences); 
      setCurrentSentenceIndex(0); 
    }
  }, [shuffleQuestions]);

  useEffect(() => {
    // Initial tutorial message
    if (messages.length === 0) {
      const tutorialMessage = `Welcome to the German translation app!\n\nIn this app, you'll practice translating English sentences into German. Simply type your translation in the input box and hit 'Translate' or press 'Enter'. If you want to see the correct answer, click on 'Show Answer'. Let's get started!`;
      setMessages([{ text: tutorialMessage, type: 'bot' }]);
    } else if (messages.length === 1) { // Only add the first sentence if it's the first response
      const initialBotMessage = `Bot: ${updateCurrentSentence().en}`;
      setMessages(prevMessages => [...prevMessages, { text: initialBotMessage, type: 'bot' }]);
    }
  }, [messages]);

  // Effect to scroll to the bottom of the messages when they change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle key down event in textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && userInput.trim()) {
      e.preventDefault(); 
      checkTranslation(); 
    }
  };

  return (
    <div className="app">
      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`chat-bubble ${message.type}`}>
              <p>{message.text.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}</p>
            </div>
          ))}
          <div ref={endOfMessagesRef} /> 
        </div>
        {messages.length > 0 && (
          <div className="translation-input">
            <textarea 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your translation here..."
              onKeyDown={handleKeyDown}
            />
            <div className="button-container">
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
                disabled={!userInput.trim() && messages.length > 0} 
              >
                Translate
              </button>
              <button 
                onClick={showCorrectAnswer} 
                style={{ marginLeft: '10px' }} 
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
