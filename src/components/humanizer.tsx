import React, { useState } from 'react';
import axios from 'axios';


function HumanizeSOP() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleHumanize = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/humanize', { sop: inputText });
      setOutputText(response.data.humanized);
    } catch (error) {
      console.error('Error humanizing SOP:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <textarea
        className="w-full border p-2 mb-2"
        rows={8}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste your SOP here"
      />
      <button onClick={handleHumanize} disabled={loading} className="bg-blue-500 text-white px-4 py-2">
        {loading ? 'Humanizing...' : 'Humanize SOP'}
      </button>
      <textarea
        className="w-full border p-2 mt-4"
        rows={8}
        value={outputText}
        placeholder="Humanized SOP will appear here"
        readOnly
      />
    </div>
  );
}

export default HumanizeSOP;
