const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(morgan('common', { stream: fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' }) }));

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

//  √   Get list of users
app.get('/users', (req, res) => {
    res.json(users);
});

//  √   Get user by name
app.get('/users/:username', (req, res) => {
    res.json(users.find((user) => {
        return user.username === req.params.username
    }))
});

//Get user by userId
app.get('/users/:id', (req, res) => {
    const userId = req.params.id.toString();
    const user = users.find(user => user._id.toString() === userId);

    if (user) {
        res.json(user); 
    } else {
        res.status(404).json({ message: 'User not found' }); 
    }
});

//  √ Get courses by userId
app.get('/courses/:userid', (req, res) => {
    const userCoursnames = courses.filter((course) => course.userId === req.params.userid);
    res.json(userCoursnames)
});

app.get('/flashcards/:courseid', (req, res) => {
    const courseFlashcards = flashcards.filter((flashcard) => flashcard.course_id == req.params.courseid);
    res.json(courseFlashcards);
});

//POST REQUESTS
//  √   Add new user
app.post("/users", (req, res) => {
    try {
        const newUser = req.body;

        if (!newUser.username) {
            return res.status(400).json({ message: "Username is missing in your request." });
        }

        newUser._id = uuidv4();
        users.push(newUser);
        
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//  Add new course using userid
app.post("/courses/:userid", (req, res) => {
    try {
        const { userid } = req.params; // Extract userId from the request URL
        const { courseName } = req.body; // Extract courseName from request body

        // Validate if courseName is provided
        if (!courseName) {
            return res.status(400).json({ message: "Course name is missing in your request." });
        }

        // Check if the user exists before adding the course
        const userExists = users.some(user => user._id === userid);
        if (!userExists) {
            return res.status(404).json({ message: "User not found." });
        }

        // Create a new course
        const newCourse = {
            _id: uuidv4(), // Generate a unique ID
            userId: userid, // Assign user ID from params
            courseName
        };

        // Add to courses array
        courses.push(newCourse);

        // Respond with the newly created course
        res.status(201).json(newCourse);
    } catch (error) {
        console.error("Error adding the new course:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//  PUT REQUESTS

app.put('/users/:username', (req, res) => {
    let user = users.find(user => {
        return user.username === req.params.username
    });

    if (user) {
        user.email(req.params.classs)
    }
})

//  √   DELETE REQUESTS
app.delete("/users/:id", (req, res) => {
    const userId = req.params.id.toString();
    const userIndex = users.findIndex(user => user._id === userId);

    if (userIndex !== -1) {
        users.splice(userIndex, 1); //Removing user from the array
        res.status(200).json({message: `User ${userId} was deleted.`});
    } else {
        res.status(404).json({message: "User not found."});
    }
});

// Listening for requests
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use((error, req, res, next) => {
    console.log(`Error: ${error.stack}`);
    res.status(500).send("Something broke.")
})

//GET USER BY ID AND DELETE FUNCTIONS ARE TO DOS