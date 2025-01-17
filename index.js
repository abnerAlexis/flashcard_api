const express = require('express');
const app = express();

let users = [
    {
        username: 'tester',
        email: 'test@flashcard.com'
    }
]

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

// GET requests
// pp.METHOD(PATH, HANDLER) => METHOD refers to http methods(GET, POST, PUT, PATCH, DELETE)
app.get('/', (req, res) => {
    res.send("This is the flashcard app.");
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
app.listen(8080, () => {
    console.log('Flashcard App is listening on port 8080.');
});