import { useState, useEffect, useCallback } from 'react';
import { OpenAI } from './openAI';

function App() {
  const [input, setInput] = useState('');
  const [matchData, setMatchData] = useState();
  const [aiResponse, setAiResponse] = useState();

  useEffect(() => {
    async function fetchData() {
      const response = await OpenAI.gatherMyMatchData()
      setMatchData(prev => [...prev, response])
    }
    fetchData();
  }, [])

  // Handle the form submission
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    const response = await OpenAI.analyzeData(input, matchData)
    setAiResponse(() => response)
  }, [input, matchData]);

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Question:
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
      <p>AI RESPONSE: {aiResponse}</p>
    </form>
  );
}

export default App;
