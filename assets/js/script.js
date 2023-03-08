/* Variables selecting ids */
var initialPage = document.querySelector("#initial-page");
var quizPage = document.querySelector("#question");
var quizFinished = document.querySelector("#finish");
var scoresPage = document.querySelector("#scores");
var timesUpPage = document.querySelector("#times-up");
var startButton = document.querySelector("#start-button");
var heading = document.querySelector("#question h2");
var questionP = document.querySelector("#question p");
var answers = document.querySelectorAll("#question li");
var correct = document.querySelector("#question #correct");
var timerHeading = document.querySelector("#question #timer");
var finalScore = document.querySelector("#finish ul");
var initialsForm = document.querySelector("#finish form");
var initialsInput = document.querySelector("#finish input");

// Question library for questions
var questionLibrary = [
    {
        text: `What CSS stands for?`,
        answers: [
            {
                text: `Coconut Super Strong`,
                correct: false
            },
            {
                text: `Cascading Style Sheet`,
                correct: true
            },
            {
                text: `Creative Style Sheet`,
                correct: false
            },
            {
                text: `Contiguous Strong Style`,
                correct: false
            }
        ]
    },
    {
        text: `How do you create a Paragraph in HTML?`,
        answers: [
            {
                text: `Using: <p>`,
                correct: true
            },
            {
                text: `Using: <par>`,
                correct: false
            },
            {
                text: `Using: <sector>`,
                correct: false
            },
            {
                text: `Using: -p`,
                correct: false
            }
        ]
    },
    {
        text: `Inside which HTML element do we put the JavaScript?`,
        answers: [
            {
                text: `<js>`,
                correct: false
            },
            {
                text: `<scripting>`,
                correct: false
            },
            {
                text: `<javascript>`,
                correct: false
            },
            {
                text: `<script>`,
                correct: true
            }
        ]
    },
    {
        text: `How do you create a function in JavaScript?`,
        answers: [
            {
                text: `function:myFunction()`,
                correct: false
            },
            {
                text: `function = myFunction()`,
                correct: false
            },
            {
                text: `function myFunction()`,
                correct: true
            },
            {
                text: `All of the above`,
                correct: false
            }
        ]  
    },
    {
        text: `When passing an object or array into local storage, what method must be used?`,
        answers: [
            {
                text: `JSON.parse()`,
                correct: false
            },
            {
                text: `.toString()`,
                correct: false
            },
            {
                text: `JSON.stringify()`,
                correct: true
            },
            {
                text: `.join()`,
                correct: false
            }
        ]
    }
]

// Shuffling function for questions and anwers
var shuffle = sourceArray => {
    for (var i = 0; i < sourceArray.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));

        var temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
}

var x = {
    correct: 0,
    incorrect: 0,
    timeLeftCount: 0
}

// Function to show Initial page
var init = () => {
    scoresPage.classList.add("hide");
    initialPage.classList.remove("hide");
}

// Function to initiate game
var startGame = () => {
    initialPage.classList.add("hide");
    quizPage.classList.remove("hide");

    // Shuffle question order each time game is started
    shuffle(questionLibrary);

    correct.textContent = "";

    // Record scores for each round
    var correctCount = 0;
    var incorrectCount = 0;

    // Declares empty array and then populates with four spans
    var answerText = document.querySelectorAll("#question li span");
    
    var timeLeft = 60;
    timerHeading.textContent = "Timer: " + timeLeft;

    document.querySelector("#question #timer").innerText = "Timer: " + timeLeft;

    var questionCounter = 0;

    var questionServer = (question) => {        
        heading.textContent = `Question ${question + 1}`;
        questionP.textContent = questionLibrary[question].text;
        var answerCounter = 0;
        answers.forEach (answer => {
            answerText[answerCounter].textContent = questionLibrary[question].answers[answerCounter].text;
            answer.setAttribute("data-correct", `${questionLibrary[question].answers[answerCounter].correct}`);
            answerCounter++;
        })
    }

    var timerFunction = () => {
        timerHeading.textContent = "Timer: " + timeLeft;

        if (timeLeft <= 0) {
            // Prevents questionTimer from continuing to run in background
            clearInterval(questionTimer);
            quizPage.classList.add("hide");
            timesUpPage.classList.remove("hide");
            answers.forEach(answer => {
                answer.removeEventListener("click", questionChecker);
            })
            var timeLeft2 = 2;
            // Timer for how long Times Up screen displays
            var timesUpTimer = setInterval(function () {
                if (timeLeft2 === 0) {
                    // Prevents timesUpTimer from continuing to run in background
                    clearInterval(timesUpTimer);
                    timesUpPage.classList.add("hide");
                    // Stores finish time and scores in global x object
                    x.timeLeftCount = timeLeft;
                    x.correct = correctCount;
                    x.incorrect = incorrectCount;
                    showquizFinished();
                }
                timeLeft2--;
            }, 1000);
            // Prevents timeLeft decrementer from running again (resulting in -1 final time) if timer hits 0
            return;
        }
        timeLeft--;
        // Sets 1 second interval
    }

    var questionTimer = setInterval(timerFunction, 1000);

    questionServer(0);

    // Function to evaluate if questions are correct and serve next question
    var questionChecker = event => {

    if (
        (event.target.dataset.correct === "true") ||
        (event.target.parentElement.dataset.correct === "true")
    ) {
        correctCount++;
        correct.textContent = "Correct!";
    } else {
        if (timeLeft >= 5) {
            timeLeft -= 5;
        } else {
            timeLeft = 0;
        }
            
        incorrectCount++;
        correct.textContent = "Wrong...";
    }
        
        questionCounter++;
        if (questionLibrary[questionCounter]) {
            questionServer(questionCounter);
            
        // Once all questions have been answered
        } else {
            // Prevents questionTimer from continuing to run in background
            clearInterval(questionTimer);
            // Stores finish time and scores in global x object
            x.timeLeftCount = timeLeft;
            x.correct = correctCount;
            x.incorrect = incorrectCount;
            showquizFinished();
            
            // Resets questionCounter to 1
            questionCounter = 1;
            // Removes answer event listeners so they aren't stacked on next startGame() call
            answers.forEach(answer => {
                answer.removeEventListener("click", questionChecker);
            })
        }
    };

    answers.forEach(answer => {
        answer.addEventListener("click", questionChecker);
    })
}

var finalScoresArray = [];

var showquizFinished = () => {
    quizPage.classList.add("hide");
    quizFinished.classList.remove("hide");

    // Clears any existing score so new score isn't appended onto existing list items
    finalScore.textContent = "";

    var listItems = [];

    // Creates an array of 3 list items
    for (var i = 0; i < 3; i++) {
        listItems.push(document.createElement("li"));
    }

    // Assigns score values to list items
    listItems[0].textContent = `Time Remaining: ${x.timeLeftCount}`;
    listItems[1].textContent = `# Right: ${x.correct}`;
    listItems[2].textContent = `# Wrong: ${x.incorrect}`;

    // Appends each list item to ul
    listItems.forEach(listItem => {
        finalScore.appendChild(listItem);
    })

    var initialsSubmission = event => {
        event.preventDefault();

        x.initials = initialsInput.value;

        var xArray = [x.initials, x.timeLeftCount, x.correct];
        finalScoresArray.push(xArray);

        // Sends xArray to localStorage
        localStorage.setItem("scores", JSON.stringify(finalScoresArray));
        showScores();

        initialsForm.removeEventListener("submit", initialsSubmission);
    }

    initialsForm.addEventListener("submit", initialsSubmission);
}

var showScores = () => {
    quizPage.classList.add("hide");
    quizFinished.classList.add("hide");
    initialPage.classList.add("hide");
    scoresPage.classList.remove("hide");
    
    var scoreList = document.querySelector("#scores ul");

    // Retrieves scores value from localStorage
    var scores = JSON.parse(localStorage.getItem("scores"));

    var playAgain = document.querySelector("#play-again");

    playAgain.addEventListener("click", init);

    // Checks if there are scores to display in LocalStorage()
    if (scores) { 
        var scoreListItems = [];

        // Clears any existing scores so list items aren't appended onto existing list items
        scoreList.textContent = "";

        // Creates as many list items as there are score entries
        for (var i = 0; i < scores.length; i++) {
            scoreListItems.push(document.createElement("li"));
        }

        // Assigns scores from each round to one list item
        for (var i = 0; i < scoreListItems.length; i++) {
            scoreListItems[i].textContent = `${scores[i][0]}: ${scores[i][2]} correct | ${scores[i][1]} seconds`;
            scoreList.appendChild(scoreListItems[i]);
        }

        var clearScores = document.querySelector("#clear-scores");

        clearScores.addEventListener("click", () => {
            localStorage.clear();
            scoreListItems.forEach(listItem => {
                listItem.remove();
            })
            scoreList.textContent = "Cleared!";
            // Empties array so scores aren't saved when localStorage is cleared
            finalScoresArray = [];
        })
    } else {
        // Filler text if no scores are stored in localStorage
        scoreList.textContent = "Awaiting new scores!";
    }
}

// Start button event listener to call startGame()
startButton.addEventListener("click", startGame);

// Calls init() at run time
init();