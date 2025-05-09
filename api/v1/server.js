import express from 'express';
import { handler } from './index.js';

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Define a GET route for browser testing
app.get('/', async (req, res) => {
  const event = {}; // Simulate an event if needed
  try {
    const response = await handler(event);
    res.status(response.statusCode).send(JSON.parse(response.body));
  } catch (error) {
    res.status(500).send({ error: 'Something went wrong', details: error.message });
  }
});

// Define a POST route to invoke the Lambda handler
app.post('/handler', async (req, res) => {
  const event = req.body; // Simulate the Lambda event with request body
  try {
    const response = await handler(event);
    res.status(response.statusCode).send(response.body);
  } catch (error) {
    res.status(500).send({ error: 'Something went wrong', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});