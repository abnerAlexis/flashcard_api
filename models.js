const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true}, 
    password: {type: String, required: true}, 
});

let courseSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, 
    courseName: {type: String, required: true},
});

let flashcardSchema = mongoose.Schema({
    courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true}, 
    question: {type:String, required: true},
    answer: {type:String, required: true},
    imageURL: {type:String}
})

let User = mongoose.model('User', userSchema);
let Course = mongoose.model('Course', courseSchema);
let Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports = {
    User,
    Course,
    Flashcard,
}