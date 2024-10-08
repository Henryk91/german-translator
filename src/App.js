import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Define sentences for different language levels
// Define sentences for different language levels
const sentencesByLevel = {
  A1: [
    { en: "Hello, how are you?", de: "Hallo, wie geht es dir?" },
    { en: "What is your name?", de: "Wie heißt du?" },
    { en: "I love learning languages.", de: "Ich liebe es, Sprachen zu lernen." },
    { en: "Where are you from?", de: "Woher kommst du?" },
    { en: "I have a dog.", de: "Ich habe einen Hund." },
    { en: "This is my friend.", de: "Das ist mein Freund." },
    { en: "I like apples.", de: "Ich mag Äpfel." },
    { en: "Can you help me?", de: "Kannst du mir helfen?" },
    { en: "What time is it?", de: "Wie spät ist es?" },
    { en: "I am hungry.", de: "Ich habe Hunger." },
  ],
  A2: [
    { en: "Where do you live?", de: "Wo wohnst du?" },
    { en: "This is a beautiful day.", de: "Das ist ein schöner Tag." },
    { en: "I have a cat.", de: "Ich habe eine Katze." },
    { en: "Do you speak English?", de: "Sprichst du Englisch?" },
    { en: "I am going to the store.", de: "Ich gehe zum Geschäft." },
    { en: "What is your favorite food?", de: "Was ist dein Lieblingsessen?" },
    { en: "I like to read books.", de: "Ich lese gerne Bücher." },
    { en: "Can we go to the park?", de: "Können wir in den Park gehen?" },
    { en: "It is raining today.", de: "Es regnet heute." },
    { en: "I want to learn German.", de: "Ich möchte Deutsch lernen." },
  ],
  B1: [
    { en: "I want to go to the cinema.", de: "Ich möchte ins Kino gehen." },
    { en: "Can you help me, please?", de: "Kannst du mir bitte helfen?" },
    { en: "What do you like to do?", de: "Was machst du gern?" },
    { en: "I have been to Berlin.", de: "Ich war in Berlin." },
    { en: "I enjoy listening to music.", de: "Ich höre gerne Musik." },
    { en: "What are your plans for the weekend?", de: "Was sind deine Pläne für das Wochenende?" },
    { en: "I think learning languages is fun.", de: "Ich denke, Sprachen lernen macht Spaß." },
    { en: "Can we meet at six o'clock?", de: "Können wir uns um sechs Uhr treffen?" },
    { en: "I have a lot of homework to do.", de: "Ich habe viel Hausaufgaben zu machen." },
    { en: "How was your vacation?", de: "Wie war dein Urlaub?" },
  ],
  B2: [
    { en: "I enjoy traveling and exploring new cultures.", de: "Ich reise gerne und entdecke neue Kulturen." },
    { en: "What are your hobbies?", de: "Was sind deine Hobbys?" },
    { en: "I am reading a fascinating book.", de: "Ich lese ein faszinierendes Buch." },
    { en: "Could you explain that to me?", de: "Könntest du das mir erklären?" },
    { en: "I prefer tea over coffee.", de: "Ich bevorzuge Tee gegenüber Kaffee." },
    { en: "I would like to improve my German skills.", de: "Ich möchte meine Deutschkenntnisse verbessern." },
    { en: "What do you think about this movie?", de: "Was hältst du von diesem Film?" },
    { en: "It’s important to stay healthy.", de: "Es ist wichtig, gesund zu bleiben." },
    { en: "I have been working here for three years.", de: "Ich arbeite seit drei Jahren hier." },
    { en: "What was the last book you read?", de: "Was war das letzte Buch, das du gelesen hast?" },
  ],
  C1: [
    { en: "I have been learning German for two years.", de: "Ich lerne seit zwei Jahren Deutsch." },
    { en: "Could you elaborate on that?", de: "Könntest du das näher erläutern?" },
    { en: "It's important to stay motivated.", de: "Es ist wichtig, motiviert zu bleiben." },
    { en: "I would appreciate your feedback on my work.", de: "Ich würde dein Feedback zu meiner Arbeit schätzen." },
    { en: "Let's discuss the topic in more detail.", de: "Lass uns das Thema ausführlicher besprechen." },
    { en: "In my opinion, collaboration is key to success.", de: "Meiner Meinung nach ist Zusammenarbeit der Schlüssel zum Erfolg." },
    { en: "I am looking forward to our meeting next week.", de: "Ich freue mich auf unser Treffen nächste Woche." },
    { en: "How do you handle difficult situations?", de: "Wie gehst du mit schwierigen Situationen um?" },
    { en: "Could you share your thoughts on this matter?", de: "Könntest du deine Gedanken zu diesem Thema teilen?" },
    { en: "It's essential to balance work and leisure.", de: "Es ist wichtig, Arbeit und Freizeit zu balancieren." },
  ],
  C2: [
    { en: "I hope to master the language soon.", de: "Ich hoffe, die Sprache bald zu beherrschen." },
    { en: "In my opinion, practice makes perfect.", de: "Meiner Meinung nach macht Übung den Meister." },
    { en: "Could you provide an example?", de: "Könntest du ein Beispiel geben?" },
    { en: "I have a deep understanding of the subject.", de: "Ich habe ein tiefes Verständnis für das Thema." },
    { en: "Let’s delve into the details of this issue.", de: "Lass uns in die Einzelheiten dieses Themas eintauchen." },
    { en: "It's crucial to keep up with current events.", de: "Es ist entscheidend, mit den aktuellen Ereignissen Schritt zu halten." },
    { en: "What is your perspective on this topic?", de: "Was ist deine Perspektive zu diesem Thema?" },
    { en: "I can articulate my thoughts clearly.", de: "Ich kann meine Gedanken klar ausdrücken." },
    { en: "It is important to approach challenges with a positive mindset.", de: "Es ist wichtig, Herausforderungen mit einer positiven Einstellung anzugehen." },
    { en: "I am well-versed in various communication techniques.", de: "Ich bin gut mit verschiedenen Kommunikationstechniken vertraut." },
  ],
};

const App = () => {
  const [currentSentence, setCurrentSentence] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [checkPunctuation, setCheckPunctuation] = useState(false); // Set to false by default
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('A1'); // Default level
  const endOfMessagesRef = useRef(null); // Reference for scrolling
  const [sentences, setSentences] = useState([]); // Store sentences for the current level

  // Effect to set sentences based on the selected level
  useEffect(() => {
    const initialSentences = sentencesByLevel[selectedLevel];
    setSentences(initialSentences);
    setCurrentSentence(initialSentences[0]); // Reset to first sentence of the level

    // Add welcome message and first sentence if it's the first render
    if (messages.length === 0) {
      setMessages([
        { text: "Welcome to the Language Learning App! Type your translation of the sentence below.", type: 'bot' },
        { text: `Bot: ${initialSentences[0].en}`, type: 'bot' }
      ]);
    }
  }, [selectedLevel]);

  // Function to check the user's translation
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

    // Add user input message before the feedback message
    setMessages(prevMessages => [
      ...prevMessages,
      { text: `You: ${userInput}`, type: 'user' }
    ]);

    if (nextSentenceIndex < sentences.length) {
      const nextSentence = sentences[nextSentenceIndex].en;
      setCurrentSentence(sentences[nextSentenceIndex]);
      feedbackMessage = `Correct! Here's another sentence:\n\n${nextSentence}`; // Add extra newline for padding;
      setMessages(prevMessages => [
        ...prevMessages,
        { text: `Bot: ${feedbackMessage}`, type: 'bot' }
      ]);
    } else {
      // Level completed
      const nextLevel = getNextLevel(selectedLevel);
      if (nextLevel) {
        feedbackMessage = `Congratulations! You've completed level ${selectedLevel}. You will now move on to level ${nextLevel}.`;
        setSelectedLevel(nextLevel); // Move to next level
        const nextSentences = sentencesByLevel[nextLevel];
        setSentences(nextSentences); // Update sentences for the new level
        setCurrentSentence(nextSentences[0]); // Set to the first sentence of the new level

        // Append the transition message to the existing messages
        setMessages(prevMessages => [
          ...prevMessages,
          { text: `Bot: ${feedbackMessage}`, type: 'bot' },
          { text: `Bot: ${nextSentences[0].en}`, type: 'bot' } // Add the first sentence of the new level
        ]);
      } else {
        feedbackMessage = "Great job! You've completed all sentences.";
        setMessages(prevMessages => [
          ...prevMessages,
          { text: `Bot: ${feedbackMessage}`, type: 'bot' }
        ]);
      }
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
      feedbackMessage = `Incorrect. You got: ${feedbackWords}.\n\nTry again:\n${currentSentence.en}`; // Add extra newline for padding
    }

    // Add feedback message after the user's translation
    setMessages(prevMessages => [
      ...prevMessages,
      { text: `You: ${userInput}`, type: 'user' },
      { text: `Bot: ${feedbackMessage}`, type: 'bot' }
    ]);
    
    // Clear user input for the next translation
    setUserInput("");
  }
};

const handleKeyDown = (e) => {
  if (e.key === 'Enter' && userInput.trim()) {
    e.preventDefault(); 
    checkTranslation(); 
  }
};
  // Function to get the next level
  const getNextLevel = (currentLevel) => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null; // Return next level or null if none
  };

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
              onKeyDown={handleKeyDown}
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
                onClick={() => {
                  setMessages(prevMessages => [
                    ...prevMessages,
                    { text: `You: Show Answer`, type: 'user' },
                    { text: `Bot: ${currentSentence.de}`, type: 'bot' } // Show the correct answer
                  ]);
                }} 
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
