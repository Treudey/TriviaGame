var questionList, index, correct, incorrect, unanswered, currentQuestion, questionTimer, timeLeft; 

var Question = function(question, answers, correctAnswer, gif) {
    this.question = question;
    this.answers = answers;
    this.correctAnswer = correctAnswer;
    this.gif = gif;
};

var q1 = new Question(
    "QI: Who was assassinated by a group of senators on the Ides of March (15 March), 44 BC?", 
    ["Mark Antony",
    "Nero",
    "Augustus Caesar",
    "Julius Caesar"], 
    3, 
    "./assets/images/julius-death.gif");

var q2 = new Question(
    'QII: Who created one of the largest empires of the ancient world in 323 BC by the age of thirty?', 
    ['Achilles',
    'Constantine the Great',
    'Alaxander the Great',
    'Augustus Caesar'],
    2, 
    "./assets/images/alexander.gif");

var q3 = new Question(
    'QIII: What was Rome\'s largest amphitheatre?', 
    ['The Circus Maximus',
    'The Colosseum',
    'The Theatre of Marcellus',
    'The Pantheon'],
    1, 
    "./assets/images/colosseum.gif");

var q4 = new Question(
    'QIV: Who wrote the two epic poems the <i>Iliad<i/> and the <i>Odyssey<i/>?', 
    ['Homer',
    'Aristotle',
    'Hesiod',
    'Virgil'],
    0, 
    "./assets/images/homer.gif");

var q5 = new Question(
    'QV: Of the Seven Wonders of the Ancient World, which is the only one still standing today?', 
    ['The Great Pyramid of Giza',
    'The Temple of Artemis at Ephesus',
    'The Statue of Zeus at Olympia',
    'The Lighthouse of Alexandria'],
    0, 
    "./assets/images/pyramids.gif");

var q6 = new Question(
    'QVI: What powerful woman famously had a love affair with both Julius Caesar and Mark Antony?', 
    ['Livia',
    'Octavia',
    'Hypatia',
    'Cleopatra'],
    3, 
    "./assets/images/cleopatra.gif");

var q7 = new Question(
    'QVII: Which ancient Greek philsopher said "The only true wisdom is in knowing you know nothing"?', 
    ['Thales',
    'Pythagoras',
    'Socrates',
    'Plato'],
    2, 
    "./assets/images/socrates.gif");

var q8 = new Question(
    'QVIII: What famous battle saw a small Greek army that included 300 Spartan hoplites take on an enormous Persian army in 480 BC?', 
    ['The Battle of Thermopylae',
    'The Battle of Marathon',
    'The Battle of Salamis',
    'The Battle of Gaugamela'],
    0, 
    "./assets/images/thermopylae.gif");    

var q9 = new Question(
    'QIX: What queen of the British Celtic Iceni tribe led an uprising against the occupying forces of the Roman Empire?', 
    ['Artemisia',
    'Boudicca',
    'Cartimandua',
    'Nefertiti'],
    1, 
    "./assets/images/boudicca.gif");    

questionList = [q1, q2, q3, q4, q5, q6, q7, q8, q9];

Question.prototype.displayQuestion = function() {
    $("#question").html(this.question);
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

function initialize() {
    index = 0;
    correct = 0;
    incorrect = 0;
    unanswered = 0;
    currentQuestion = questionList[index];
    $(".title").after('<button class="start-button">START</button>');
}

function convertToRoman(num) {
    if (num === 0) {
        return 0;
    } else {
        var roman = "";
        var romanNumerals = ["L", "XL", "X", "IX", "V", "IV", "I"];
        var numbers = [50, 40, 10, 9, 5, 4, 1];
        for (var i = 0; i < numbers.length; i++) {
            while(num >= numbers[i]) {
                roman += romanNumerals[i];
                num -= numbers[i];
            }
        }
        return roman;
    }
}

function processGuess(guess) {
    clearInterval(questionTimer);
    if (guess === 0) {
        createResultPage(guess);
        unanswered++;
    } else if (currentQuestion.checkIfCorrect(guess)) {
        createResultPage(true);
        correct++;
    } else {
        createResultPage(false);
        incorrect++;
    }
    index++;
    if (index > questionList.length - 1) {
        setTimeout(createStatsPage, 5000);
    } else {
        currentQuestion = questionList[index];
        setTimeout(createQuestionPage, 5000);
    }
}

function timer() {
    timeLeft--;
    $("#time").text(convertToRoman(timeLeft) + " Seconds");

    if (timeLeft === 0) {
        processGuess(timeLeft);
    }
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
    $("#time").text(convertToRoman(timeLeft) + " Seconds");
    questionTimer = setInterval(timer, 1000);
}

function createResultPage(result) {
    $(".answers").remove();
    $("<img>").appendTo(".question-div");
    if (result === true) {
        $("#question").text("Correct!");
        currentQuestion.correctGuess();
    } else {
        $("#question").after('<p class="incorrect-text">The Correct Answer was: <span class="incorrect-text" id="correct-answer"></span></p>');
        currentQuestion.incorrectGuess();
        if (result === false) {
            $("#question").text("Incorrect!");
        } else if (result === 0) {
            $("#question").text("Out of Time!");
        }
    }
}

function createStatsPage() {
    $("#time-remaining").remove();
    $("#question").remove();
    $(".incorrect-text").remove();
    $("img").remove();
    $(".question-div").append('<h2 class="end-text">All done! Here\'s how you did:</h2>');
    $(".question-div").append('<p class="stats">Correct Answers: ' + convertToRoman(correct) + '</p>');
    $(".question-div").append('<p class="stats">Incorrect Answers: ' + convertToRoman(incorrect) + '</p>');
    $(".question-div").append('<p class="stats">Unanswered: ' + convertToRoman(unanswered) + '</p>');
    $(".question-div").append('<button class="reset-button">START OVER?</button>');
}

$(document).ready(function() {

    initialize();

    $(document).on("click", ".start-button", function() {
        $(this).remove();
        createQuestionPage();
    });
    
    $(document).on("click", ".answers", function() {
        var guess = $(this).text();
        processGuess(guess);
    });
    
    $(document).on("click", ".reset-button", function() {
        $(".question-div").empty();
        initialize();
    });
})

