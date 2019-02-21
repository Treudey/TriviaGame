var questionList, index, correct, incorrect, unanswered, currentQuestion, questionTimer, timeLeft; 

var Question = function(question, answers, correctAnswer, gif) {
    this.question = question;
    this.answers = answers;
    this.correctAnswer = correctAnswer;
    this.gif = gif;
};

var q1 = new Question(
    "Who was assassinated by a group of senators on the Ides of March (15 March), 44 BC?", 
    ["Mark Antony",
    "Nero",
    "Augustus Caesar",
    "Julius Caesar"], 
    3, 
    "./assets/images/julius-death.gif");

var q2 = new Question(
    'Who was the first man to walk on the moon?', 
    ['Neil Armstrong',
    'Buzz Aldrin',
    'Alan Shepard',
    'John Glenn'],
    0, 
    "./assets/images/alexander.gif");

questionList = [q1, q2];
index = 0;
correct = 0;
incorrect = 0;
unanswered = 0;
currentQuestion = questionList[index];


Question.prototype.displayQuestion = function() {
    $("#question").text(this.question);
    for (var i = 0; i < this.answers.length; i++) {
        $("#answer" + i).text(this.answers[i]);
    }
}

Question.prototype.correctGuess = function() {
    $("img").attr("src", this.gif);
}

Question.prototype.incorrectGuess = function() {
    $("#correct-answer").text(this.answers[this.correctAnswer]);
    $("img").attr("src", this.gif);
}

Question.prototype.checkIfCorrect = function(guess) {
    return guess === this.answers[this.correctAnswer];
}

function createQuestionPage() {
    if (!$("#time-remaining").length) {
        $(".question-div").append('<h2 class="question-info" id="time-remaining">Time Remaing: <span class="question-info" id="time"></span></h2>');
        $(".question-div").append('<p class="question-info" id="question"></p>');
    } else {
        $(".incorrect-text").remove();
        $("img").remove();
    }
    for (var i = 0; i < 4; i++) {
        $(".question-div").append('<button class="answers" id="answer' + i + '"></button>');
    }
    currentQuestion.displayQuestion();
    timeLeft = 30;
    $("#time").text(timeLeft + " Seconds");
    questionTimer = setInterval(timer, 1000);
}

function timer() {
    timeLeft--;
    $("#time").text(timeLeft + " Seconds");

    if (timeLeft === 0) {
        guessResult(timeLeft);
    }
}
function createResultPage(result) {
    $(".answers").remove();
    $("<img>").appendTo(".question-div");
    if (result === "correct") {
        $("#question").text("Correct!");
        currentQuestion.correctGuess();
    } else {
        $("#question").after('<p class="incorrect-text">The Correct Answer was: <span class="incorrect-text" id="correct-answer"></span></p>');
        currentQuestion.incorrectGuess();
        if (result === "incorrect") {
            $("#question").text("Incorrect!");
        } else if (result === "out of time") {
            $("#question").text("Out of Time!");
        }
    }
}

function guessResult(guess) {
    clearInterval(questionTimer);
    if (guess === 0) {
        createResultPage("out of time");
        unanswered++;
    } else if (currentQuestion.checkIfCorrect(guess)) {
        createResultPage("correct");
        correct++;
    } else {
        createResultPage("incorrect");
        incorrect++;
    }
    index++;
    currentQuestion = questionList[index];
    setTimeout(createQuestionPage, 5000);
}

$(document).on("click", "#start", function() {
    $(".question-div").empty();
    createQuestionPage();
});

$(document).on("click", ".answers", function() {
    var guess = $(this).text();
    guessResult(guess);
});