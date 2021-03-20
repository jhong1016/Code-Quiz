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
        title: "Arrays in Javascript can be used to store ____.",
        choices: ["numbers and strings", "other arrays", "booleans", "all of the above"],
        answer: "all of the above",
    },
    {
        title: "String values must be enclosed within ____ when being assigned to variables.",
        choices: ["commas", "curly brackets", "quotes", "parenthesis"],
        answer: "quotes",
    },
    {
        title: "A very useful tool for used during development and debugging for printing content to the debugger is:",
        choices: ["Javascript", "terminal / bash", "for loops", "console log"],
        answer: "console log",
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
		queryElement('#highScores div').innerHTML = "";
		var i = 1;
		recordsArray.sort((a, b) => b.score - a.score);
		Array.from(recordsArray).forEach(check =>
		{
			var scores = document.createElement("div");
			scores.innerHTML = i + ". " + check.initialRecord + " - " + check.score;
			queryElement('#highScores div').appendChild(scores);
			i = i + 1
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

    // FUNCTION changes the question and has a parameter to control the text which is provided whether it is correct or incorrect
	var quizUpdate = (answerCopy) => {
		queryElement('#scoreIndicator p').innerHTML = answerCopy;
		queryElement('#scoreIndicator').classList.remove('invisible', scoreIndicator());
		Array.from(answers).forEach(answer =>
		{
			answer.classList.add('disable');
		});

        // If all the questions have been answered exit the quiz section
        setTimeout(() => {
            if (qCount === questions.length) {
                onlyDisplaySection("#finish");
                time = 0;
                queryElement('#time').innerHTML = time;
            } else {
				// Updates copy in questions with the net array's question text
				setQuestionData();
				// Removed disabled status
				Array.from(answers).forEach(answer => {
					answer.classList.remove('disable');
				});
			}
		}, 1000);
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
	let scoreIndicator = () => {
		clearTimeout(timeset);
		timeset = setTimeout(() => {
		    queryElement('#scoreIndicator').classList.add('invisible');
		}, 1000);
	}

    //// QUIZ CONTROLS ////

    // Create an array of selected divs so they can be referred to with this keyword and replace their values to then check against the answer property for all questions.
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

    //// SCORE SUBMISSION ////

    // Display error message if initials given do not meet requirements
    var errorIndicator = () => {
        clearTimeout(timeset);
        timeset = setTimeout(() => {
            queryElement('#errorIndicator').classList.add('invisible');
        }, 3000);
    }

    // Error handling for submitting high scores
	queryElement("#records button").addEventListener("click", () => {
	var initialsRecord = queryElement('#initials').value;
		if (initialsRecord === ''){
			queryElement('#errorIndicator p').innerHTML = "You need at least 1 character.";
			queryElement('#errorIndicator').classList.remove('invisible', errorIndicator());
		} else if (initialsRecord.match(/[[A-Za-z]/) === null) {
			queryElement('#errorIndicator p').innerHTML = "Only letters for initials allowed.";
			queryElement('#errorIndicator').classList.remove('invisible', errorIndicator());
		} else if (initialsRecord.length > 5) {
			queryElement('#errorIndicator p').innerHTML = "Maximum of 5 characters allowed.";
			queryElement('#errorIndicator').classList.remove('invisible', errorIndicator());
		} else {
			// Sends value to current array for use now
			recordsArray.push({
				"initialRecord": initialsRecord,
				"score": score,
			});
			// Sends value to local storage for later use
			localStorage.setItem('recordsArray', JSON.stringify(recordsArray));
			queryElement('#highScores div').innerHTML = '';
			onlyDisplaySection("#highScores");
			recordsHtmlReset();
			queryElement("#initials").value = '';
		}
	});

    //// HIGH SCORE CONTROL ARRAY/LOCAL STORAGE ////

	// Clears highscores from the html, array and localstorage
	queryElement("#clearScores").addEventListener("click", () => {
		recordsArray = [];
		queryElement('#highScores div').innerHTML = "";
		localStorage.removeItem('recordsArray');
	});

	// Resets all quiz settings to default to replay the quiz
	queryElement("#reset").addEventListener("click", () => {
		time = initialTime;
		score = 0;
		qCount = 0;
		onlyDisplaySection("#intro");
	});

	// If a player pushes the view high scores button in the html view then this abdandons all quiz progress and lets them view the high scores
	queryElement("#scores").addEventListener("click", (e) => {
		e.preventDefault();
		clearInterval(clock);
		queryElement('#time').innerHTML = 0;
		time = initialTime;
		score = 0;
		qCount = 0;
		onlyDisplaySection("#highScores");
		recordsHtmlReset();
	});

});