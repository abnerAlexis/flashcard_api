const express = require('express');
const morgan = require('morgan')
const app = express();

let users = [
    {
        username: 'tester',
        email: 'test@flashcard.com'
    }
];

let classes = [
    {
        name: 'Biology',
        userId: 'testerId',
    }
];

let flashcards = [
    {
        question: 'What is photosynthesis?',
        answer: 'The process by which plants convert light energy into chemical energy.',
        image: 'https://www.sciencewithme.com/img/photosynthesis_11.jpg',
        class_id: '',
        user_id: 'testerId',
    }
];

  app.use(morgan('common'));

  app.get('/secreturl', (req, res) => {
    res.send(`<h1>This is the URL.</h1>`);
  
  });

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

app.get('/classes', (req, res) => {
    res.json(classes);
});

app.get('/flashcards', (req, res) => {
    res.json(flashcards);
});


// Listening for requests
app.listen(3000, () => {
    console.log('Flashcard App is listening on port 3000.');
});