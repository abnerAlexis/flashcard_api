const express = require('express'),
morgan = require('morgan'),
fs = require('fs'),
bodyParser = require('body-parser'),
uuid = require('uuid'),
path = require('path');

const app = express();
const PORT = 3000;

//creating a write stream(in append mode)
// `log.txt` file is created in the root dir
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

//setup the logger
app.use(morgan('common', {stream: accessLogStream}));

let users = [
    {
        _id: '01',
        username: 'tester',
        email: 'test@flashcard.com',
        password: 'tttttttt',
    },
    {
        _id: '02',
        username: 'betty',
        email: 'betty@flashcard.com',
        password: 'bbbbbbbb',
    }
];

let courses = [
    {
        _id: '1',
        userId: '01',
        courseName: 'Biology',
    },
    {
        _id: '2',
        userId: '02',
        courseName: 'Chemistry',
    },
    {
        _id: '3',
        userId: '01',
        courseName: 'Physics',
    },
];

let flashcards = [
    {
        _id: '0001',
        course_id: '1',
        question: 'What is photosynthesis?',
        answer: 'The process by which plants convert light energy into chemical energy.',
        image: 'https://www.sciencewithme.com/img/photosynthesis_11.jpg',
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

// Get list of users
app.get('/users', (req, res) => {
    res.json(users);
});

// Get user by name
app.get('/users/:username', (req, res) => {
    res.json(users.find((user) => {
        return user.username === req.params.username
    }))
});

// Get courses by userId
app.get('/courses/:userid', (req, res) => {
    const userCoursnames = courses.filter((course) => course.userId === req.params.userid);
    res.json(userCoursnames)
});

app.get('/flashcards/:courseid', (req, res) => {
    const courseFlashcards = flashcards.filter((flashcard) => flashcard.course_id == req.params.courseid);
    res.json(courseFlashcards);
});

//POST REQUESTS
app.post('/users', (req, res) => {
    let newUser = req.body;
    if(!newUser.username) {
        const message = 'Username is missing in your request.';
        res.status(400).send(message);
    } else {
        newUser._id = uuid.v4()
    }
})

// Listening for requests
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use((error, req, res, next) => {
    console.log(`Error: ${error.stack}`);
    res.status(500).send("Something broke.")
})