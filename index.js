const express = require('express'),
morgan = require('morgan'),
fs = require('fs'),
path = require('path');

const app = express();

//creating a write stream(in append mode)
// `log.txt` file is created in the root dir
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

//setup the logger
app.use(morgan('common', {stream: accessLogStream}));

let users = [
    {
        username: 'tester',
        email: 'test@flashcard.com',
    }
];

let flashcards = [
    {
        question: 'What is photosynthesis?',
        answer: 'The process by which plants convert light energy into chemical energy.',
        image: 'https://www.sciencewithme.com/img/photosynthesis_11.jpg',
        course_id: '',
    },
    {
        "question": "What is mitosis?",
        "answer": "Mitosis is the process by which a cell divides its nucleus and contents into two identical daughter cells.",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/79/Mitosis_Stages.svg",
        "course_id": "BIO101"
      }
];

app.get('/', (req, res) => {
    res.send(`
        <html>
          <head>
            <link rel="icon" type="image/png" href="./reddaisy.png" />
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color:rgb(102, 6, 6);
              }
              h1 {
                font-family: Arial, sans-serif;
                text-align: center;
                color: #fff; /* text color */
              }
            </style>
          </head>
          <body>
            <h1>This is the flashcard API.</h1>
          </body>
        </html>
      `);
})

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname});
});

app.get('/users', (req, res) => {
    res.json(users);
});

app.get('/courses', (req, res) => {
    res.json(courses);
});

app.get('/flashcards', (req, res) => {
    res.json(flashcards);
});


// Listening for requests
app.listen(3000, () => {
    console.log('Flashcard App is listening on port 3000.');
});

app.use((error, req, res, next) => {
    console.log(`Error: ${error.stack}`);
    res.status(500).send("Something broke.")
})