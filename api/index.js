// // index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv'); 
const db = require('./db');
const fileRouter = require('./routers/fileRouter');
const authRouter = require('./routers/authRouter');
const path = require('path');

dotenv.config(); 
const app = express();
const port = process.env.PORT || 3000; 
app.use(bodyParser.json());
app.use(express.json());

app.use(cors({
  origin:['https://app.uniquemarine.co.in','http://localhost:5173','http://localhost:3000'], // Allow the frontend to access
  methods: ['GET', 'POST', 'OPTIONS','DELETE'], // Allow the necessary methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
}));

    app.use(express.static(path.join(__dirname, '../dist')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/file', fileRouter);
app.use('/admin', authRouter);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html')); // Update to your React build folder
});

app.listen(port,()=>{
  console.log(`server running in http://localhost:${port}`)
})


