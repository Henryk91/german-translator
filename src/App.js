import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Sentence sets for different levels
const sentencesByLevel = {
  A1: [
    { en: "Hello, how are you?", de: "Hallo, wie geht es dir?" },
    { en: "What is your name?", de: "Wie heißt du?" },
  ],
  A2: [
    { en: "I love learning languages.", de: "Ich liebe es, Sprachen zu lernen." },
    { en: "Where do you live?", de: "Wo wohnst du?" },
  ],
  B1: [
    { en: "This is a beautiful day.", de: "Das ist ein schöner Tag." },
    { en: "I like to travel to different countries.", de: "Ich reise gerne in verschiedene Länder." },
  ],
  B2: [
    { en: "What are your hobbies?", de: "Was sind deine Hobbys?" },
    { en: "I enjoy reading books.", de: "Ich lese gerne Bücher." },
  ],
  C1: [
    { en: "I appreciate the complexities of language.", de: "Ich schätze die Komplexität der Sprache." },
    { en: "It’s important to understand cultural contexts.", de: "Es ist wichtig, kulturelle Kontexte zu verstehen." },
  ],
  C2: [
    { en: "I can discuss abstract concepts fluently.", de: "Ich kann abstrakte Konzepte fließend diskutieren." },
    { en: "Understanding nuances in language is crucial.", de: "Das Verständnis von Nuancen in der Sprache ist entscheidend." },
  ],
};

const App = () => {
  const [sentences, setSentences] = useState([]); // Initialize with an empty array
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [checkPunctuation, setCheckPunctuation] = useState(false);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('A1'); // Default level
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

    if (!currentSentence) {
      return; // Prevent further execution if no current sentence
    }

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

  // Function to show the correct translation
  const showCorrectAnswer = () => {
    const currentSentence = updateCurrentSentence(); 

    if (!currentSentence) {
      return; // Prevent further execution if no current sentence
    }

    const correctAnswerMessage = `The correct answer is: ${currentSentence.de}`;

    // Add user input and feedback to messages
    setMessages(prevMessages => [
      ...prevMessages,
      { text: `You: Show Answer please`, type: 'user' },
      { text: `Bot: ${correctAnswerMessage}`, type: 'bot' }
    ]);

    // Move to the next sentence if available
    setCurrentSentenceIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      if (nextIndex < sentences.length) {
        return nextIndex; 
      }
      return prevIndex; 
    });
    setUserInput(""); 
  };

  // Effect to update sentences based on selected level
  useEffect(() => {
    const newSentences = sentencesByLevel[selectedLevel] || [];
    setSentences(newSentences);
    setCurrentSentenceIndex(0); // Reset index to the first sentence
    setMessages([]); // Clear messages
  }, [selectedLevel]);

  useEffect(() => {
    // Shuffle sentences if required
    if (shuffleQuestions) {
      const shuffledSentences = shuffleArray([...sentences]); 
      setSentences(shuffledSentences);
      setCurrentSentenceIndex(0); 
    }
  }, [shuffleQuestions]);

  useEffect(() => {
    // Initial tutorial message
    if (messages.length === 0) {
      const tutorialMessage = `Welcome to the German translation app!\n\nIn this app, you'll practice translating English sentences into German. Simply type your translation in the input box and hit 'Translate' or press 'Enter'. If you want to see the correct answer, click on 'Show Answer'. Let's get started!`;
      setMessages([{ text: tutorialMessage, type: 'bot' }]);
    } else if (messages.length === 1) { // Only add the first sentence if it's the first response
      const initialBotMessage = sentences.length > 0 ? `Bot: ${updateCurrentSentence().en}` : '';
      if (initialBotMessage) {
        setMessages(prevMessages => [...prevMessages, { text: initialBotMessage, type: 'bot' }]);
      }
    }
  }, [messages, sentences]);

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
                <label style={{ marginLeft: '10px' }}>
                  <input 
                    type="checkbox" 
                    checked={shuffleQuestions} 
                    onChange={() => setShuffleQuestions(!shuffleQuestions)} 
                  />
                  Shuffle Questions
                </label>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <select 
                  value={selectedLevel} 
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  style={{ marginLeft: '10px' }} // Adjust for spacing
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                </select>
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