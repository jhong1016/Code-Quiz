var questions = [
    {
        title: "Commonly used data types DO NOT include:",
        choices: ["strings", "booleans", "alerts", "numbers"],
        answer: "alerts",
    },
    {
        title: "The condition in an if / else statement is enclosed within ____.",
        choices: ["quotes", "curly brackets", "parentheses", "square brackets"],
        answer: "parentheses",
    },
    {
        title: "What tag defines the body of the HTML document, and usually includes all the contents such as the text, hyperlinks, images, tables, lists, and more?",
        choices: ["<head></head>", "<body></body>", "<title></title>", "<br>"],
        answer: "<body></body>",
    },
    {
        title: "Which of these is not used to loop?",
        choices: ["for", "while", "foreach", "sequence"],
        answer: "sequence",
    },
    {
        title: "CSS stands for ____ Style Sheets.",
        choices: ["Curious", "Concept", "Cascading", "Concave"],
        answer: "Cascading",
    },
];

document.addEventListener('DOMContentLoaded', (event) => {

    //// SET INITIAL VARIABLES AND SETUP ARRAY/LOCAL STORAGE DATABASE ////

    // 1. Setting initial required variables
    const initialTime = 75;
    var time = 75;
    var score = 0;
    var qCount = 0;
    var timeset;
    var answers = document.querySelectorAll('#quizHolder button');
    
    // 2. Sets array then if local storage exists it populates it into the array of records
    var recordsArray = [];
    // Retrieve data if it exists or keep empty array otherwise
    (localStorage.getItem('recordsArray')) ? recordsArray = JSON.parse(localStorage.getItem('recordsArray')): recordsArray = [];

    //// FUNCTIONS MADE TO REDUCE REPEATED CODE ////

    // FUNCTION to more quickly call elements less typing means less chance for errors
    var queryElement = (element) => {
        return document.querySelector(element);
    }

    // FUNCTION to hide all sections then unhide the one provided by the parameter
    var onlyDisplaySection = (element) => {
        var sections = document.querySelectorAll("section");
        Array.from(sections).forEach((userItem) => {
            userItem.classList.add('hide');
        });
        queryElement(element).classList.remove('hide');
    }

    // FUNCTION to reset HTML display for the score
    var recordsHtmlReset = () => {
        queryElement('#highScores div').innerHTML = "0";
        var i = 1;
        recordsArray.sort((a, b) => b.score - a.score);
        Array.from(recordsArray).forEach(check => 
        {
            var scores = document.createElement("div");
            scores.innerHTML = i + ". " + check.initialRecord + " - " + check.score;
            queryElement('#highScores div').appendChild(scores);
            i = i + 1;
        });
        i = 0;
        Array.from(answers).forEach(answer => {
            answer.classList.remove('disable');
        });  
    }

    // FUNCTION to set the question data in questionHolder section
    var setQuestionData = () => {
		queryElement('#quizHolder p').innerHTML = questions[qCount].title;
		queryElement('#quizHolder button:nth-of-type(1)').innerHTML = `1. ${questions[qCount].choices[0]}`;
		queryElement('#quizHolder button:nth-of-type(2)').innerHTML = `2. ${questions[qCount].choices[1]}`;
		queryElement('#quizHolder button:nth-of-type(3)').innerHTML = `3. ${questions[qCount].choices[2]}`;
		queryElement('#quizHolder button:nth-of-type(4)').innerHTML = `4. ${questions[qCount].choices[3]}`;
	}

    // FUNCTION handles time related events for the quiz
    var myTimer = () => {
        if (time > 0) {
            time = time - 1;
            queryElement('#time').innerHTML = time;
        } else {
            clearInterval(clock);
            queryElement('#score').innerHTML = score;
            onlyDisplaySection("#finish");
        }
    }

    //// QUIZ INITILIZATION AND TIMER ////

    // On intro button click start time and starts giving questions
    var clock; 
    queryElement("#intro button").addEventListener("click", (e) => {
        // Call above function to set initial data in questionHolder section
        setQuestionData();
        onlyDisplaySection("#quizHolder");
        clock = setInterval(myTimer, 1000);
    });

    // Clears timeout if next question is answered before current timeout is reached or if form element has a requirement not met
    var scoreIndicator = () => {
        clearTimeout(timeset);
        timeset = setTimeout(() => {
            queryElement('#scoreIndicator').classList.add('invisible');
        }, 1000);
    }

    //// QUIZ CONTROLS ////

    // Create an array of selected divs so they can be referred to with the this keyword and replace their values to then check against the answer property for all questions.
	Array.from(answers).forEach(check => {
		check.addEventListener('click', function (event) {
			// Handles events if a question is answered correctly
			if (this.innerHTML.substring(3, this.length) === questions[qCount].answer) {
				score = score + 1;
				qCount = qCount + 1;
				quizUpdate("Correct");
			}else{
				// Handles events if a question is answered incorrectly
				time = time - 10;
				qCount = qCount + 1;
				quizUpdate("Wrong");
			}
		});
	}); 

    