// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

require('dotenv').config();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/humanize', async (req, res) => {
  const { sop } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert SOP editor who humanizes and enhances personal statements.' },
        { role: 'user', content: `Please humanize and emotionally enhance this SOP: \n\n${sop}` },
      ],
    });

    const humanized = response.data.choices[0].message.content;
    res.json({ humanized });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing the SOP');
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
