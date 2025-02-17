const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true}, 
    password: {type: String, required: true}, 
});

let courseSchema = mongoose.Schema({
    userid: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, 
    name: {type: String, required: true},
});

let flashcardSchema = mongoose.Schema({
    course_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true}, 
    question: { type: String, required: true, trim: true, minlength: 3, maxlength: 500 },
    answer: { type: String, required: true, trim: true, minlength: 1, maxlength: 1000 },
    imageURL: { type: String, trim: true},
})

let User = mongoose.model('User', userSchema);
let Course = mongoose.model('Course', courseSchema);
let Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports = {
    User,
    Course,
    Flashcard,
}