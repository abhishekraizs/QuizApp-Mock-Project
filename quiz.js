const nextButton = document.getElementById("next-button");
const timerElement = document.getElementById("time-remaining");
const scoreElement = document.getElementById("score");
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById("options");
const submitButton = document.getElementById("submit-button");

let currentQuestionIndex = 0;
let score = 0;
let timer;

const storedQuestions = localStorage.getItem('quizQuestions');
const questions = JSON.parse(storedQuestions);
if(!storedQuestions){
alert('Please register yourself first')
window.location.href='quiz-view.html'
}
showQuestions(questions[currentQuestionIndex]);
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showQuestions(question) {
    submitButton.disabled = false;

    questionElement.innerHTML = "Q" + (currentQuestionIndex + 1) + ". " + question.question;
    const optionsArray = question.incorrect_answers.concat(question.correct_answer)
    shuffleArray(optionsArray);

    optionsElement.innerHTML = "";
    const arr = ['A', 'B', 'C', 'D'];
    optionsArray.forEach((option, index) => {
        const optionButton = document.createElement("input");
        const choiceLabel = document.createElement("label");
        choiceLabel.classList.add('option-label');
        optionButton.type = 'radio';
        optionButton.name = 'option'
        optionButton.value = option
        choiceLabel.innerHTML = arr[index] + ". &nbsp;"  + option;
        optionButton.addEventListener("click", () => {
            // Remove the class from all labels before adding it to the clicked label
            const allLabels = document.querySelectorAll(".option-label");
            allLabels.forEach((otherLabel) => {
                otherLabel.classList.remove("selected-answer");
            });
            optionButton.parentElement.classList.add("selected-answer");
        });
        choiceLabel.appendChild(optionButton)
        optionsElement.appendChild(choiceLabel)
    });

}


submitButton.addEventListener("click", () => {
    const selectedOption = document.querySelector("input[name='option']:checked")
    if (selectedOption == null) {
        window.alert('Please Choose a option')
        return;
    }
    checkAnswer(selectedOption);

})
nextButton.addEventListener("click", () => {
    nextQuestion();
})
function checkAnswer(selectedOption) {
    const correct_answer = questions[currentQuestionIndex].correct_answer
    const correctOptionLabel = document.querySelector(`input[value='${correct_answer}']`);
    const selectedOptionLabel = document.querySelector(`input[value='${selectedOption.value}']`);
    selectedOptionLabel.parentElement.classList.add('selected-answer')
    correctOptionLabel.parentElement.classList.add('correct-answer');
    correctOptionLabel.parentElement.innerHTML =  `<img src="image.jpg" width="20px" height="20px" style="border-radius:50%"> &nbsp;  ${correct_answer}`;

    if (selectedOption.value == correct_answer) {
        score++;
    }
    else {
        if (selectedOptionLabel){
            selectedOptionLabel.parentElement.classList.add('wrong-answer');
            selectedOptionLabel.parentElement.innerHTML = `<img src="https://st3.depositphotos.com/4429641/37615/v/600/depositphotos_376156992-stock-illustration-cross-mark-icons-flat-round.jpg" width="20px" height="20px" style="border-radius:50%"> &nbsp;  ${selectedOption.value}`;
        }

    }
    clearInterval(timer);
    nextButton.style.display = "block";
    submitButton.disabled = true;
    scoreElement.textContent = `Score: ${score}`;
}
function startTimer() {
    let secondsLeft = 20;
    timerElement.classList.remove('panic-clock')
    timerElement.innerHTML = `&#9200 ${secondsLeft} s`;
    timer = setInterval(() => {

        secondsLeft--;
        timerElement.innerHTML = `&#9200 ${secondsLeft} s`;

        if (secondsLeft == 0) {
            const correct_answer = questions[currentQuestionIndex].correct_answer
            const correctOptionLabel = document.querySelector(`input[value='${correct_answer}']`);
            clearInterval(timer);
            alert("Oops Time's up");
            correctOptionLabel.parentElement.classList.add('correct-answer');
           correctOptionLabel.parentElement.innerHTML =  `<img src="image.jpg" width="20px" height="20px" style="border-radius:50%"> &nbsp;  ${correct_answer}`
            nextButton.style.display = "block";
            submitButton.disabled = true;
            timerElement.classList.remove('panic-clock')
            checkAnswer(-1);
        }
        else if (secondsLeft < 10) {
            timerElement.classList.add('panic-clock')
        }
    }, 1000);
}
startTimer();

function nextQuestion() {
    nextButton.style.display = "none";
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestions(questions[currentQuestionIndex]);
        startTimer();
    } else {
        questionElement.innerHTML = `You Have scored ${score} out of ${questions.length}`;
        optionsElement.innerHTML = "";
        timerElement.parentElement.style.display = "none";
        nextButton.style.display = "none";
        scoreElement.style.display = "none";
        submitButton.style.display = "none"
        document.getElementById('image').src = "https://www.shutterstock.com/shutterstock/photos/1477980572/display_1500/stock-vector-winner-s-trophy-icon-the-golden-trophy-vector-is-a-symbol-of-victory-in-a-sports-event-1477980572.jpg"
        document.getElementsByClassName("successful-quiz")[0].style.display = "block";
        document.getElementsByClassName("heading")[0].innerHTML = "Quiz Finished";
    }
}