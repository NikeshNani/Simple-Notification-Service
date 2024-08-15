const express = require('express');
const { sendNotification } = require('./controllers/emailController');

const app = express();
app.use(express.json());

app.post('/send-notification', sendNotification);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
