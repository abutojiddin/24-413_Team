const questionCont = document.getElementById('questionCont')
const questionLetter = document.getElementById('questionLetter')
const answers = document.getElementById('answers')
const nextOne = document.getElementById('nextOne')
const timerSpan = document.getElementById('timer')
const timerCont = document.getElementById('timerCont')
const score = document.getElementById('score')

nextOne.style.display = 'none'

let index = 0
let dataResults = []
let theInterval // 10s
let theTimeout // 5s
let timer = 10 // TIMER FOR QUESTION
let correctAnswer = ''
let totalScore = 0

// FETCH DATA FROM API
fetch(`https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple`)
    .then(res => res.json())
    .then(data => {
        nextOne.style.display = 'block'
        timerCont.style.display = 'block'

        totalScore = 0
        score.innerText = totalScore
        
        displayQuestion(data.results)
        dataResults = data.results

        questionInterval() // INTERVAL OF QUESTIONS
    })

// DISPLAY DATA FUNC
function displayQuestion(questions) {
    answers.innerHTML = ''

    const currentQ = questions[index]
    // console.log(currentQ)
    if (!currentQ) return;

    questionLetter.innerText = currentQ.question
    correctAnswer = currentQ.correct_answer


    // FORM API
    const theAnswers = [
        currentQ.correct_answer,
        ...currentQ.incorrect_answers
    ].sort(() => Math.random() - 0.5) // REPLACE ANSWERS

    // DISPLAY ANSWERS IN "answers" DIV
    theAnswers.forEach(theAnswer => {
        const div = document.createElement('div')
        div.className = 'answer'
        div.dataset.answer = theAnswer

        const p = document.createElement('p')
        p.innerHTML = theAnswer

        div.appendChild(p)

        div.addEventListener('click', () => checkAnswer(div))

        answers.appendChild(div)
    })
}

// CHECKING THE ANSWER
function checkAnswer(chosenDiv) {
    const allAnswers = document.querySelectorAll('.answer')
    allAnswers.forEach(div => {
        div.style.pointerEvents = 'none'
        if (div.dataset.answer === correctAnswer) div.classList.add('correct')
        if (div === chosenDiv && div.dataset.answer !== correctAnswer) div.classList.add('wrong')
    })

    if (chosenDiv.dataset.answer === correctAnswer) {
        totalScore++
        score.innerText = totalScore
    }

    clearTimeout(theTimeout) // STOP TIMEOUT TIMER
    startAnswerTimer() // START 5s TIMER
}

// TIMER AFTER
function startAnswerTimer() {
    clearInterval(theInterval)
    clearTimeout(theTimeout)

    let answerTimer = 5;
    timerSpan.innerText = answerTimer;

    theTimeout = setInterval(() => {
        answerTimer--;
        timerSpan.innerText = answerTimer;

        if (answerTimer <= 0) {
            clearInterval(theTimeout);
            nextQuestion();
        }
    }, 1000);
}

// QUESTION'S INTERVAL
function questionInterval() {
    timer = 10
    timerSpan.innerText = timer

    theInterval = setInterval(() => {
        timer--
        timerSpan.innerText = timer

        if (timer <= 0) {
            clearInterval(theInterval)
            showCorrectAnswer()
        }
    }, 1000)
}

function showCorrectAnswer() {
    const allAnswers = document.querySelectorAll('.answer')
    allAnswers.forEach(div => {
        div.style.pointerEvents = 'none'
        if (div.dataset.answer === correctAnswer) div.classList.add('correct')
    })

    startAnswerTimer() // START 5s TIMER
}

// SHOW QUESTION BY CLICK
nextOne.addEventListener('click', () => {
    nextQuestion()
})

// SHOW NEXT QUESTION
function nextQuestion() {
    clearInterval(theInterval)
    clearTimeout(theTimeout)
    timer = 10

    index++
    if (index < dataResults.length) {
        displayQuestion(dataResults)
        questionInterval()
    } else {
        finishQuiz()
    }
}

// FINISH QUIZ FUNC
function finishQuiz() {
    questionLetter.innerText = '🎉 Savollar tugadi!'
    answers.innerHTML = ''
    nextOne.style.display = 'none'
    timerCont.style.display = 'none'
}