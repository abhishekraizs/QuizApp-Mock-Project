document.getElementById('registration-form')?.addEventListener('submit', function (event) {
    event.preventDefault();
    var numberOfQuestions = document.getElementById('number-question').value;
    var level = document.getElementById("diff-select").value;
    var questionCategory = document.getElementById("cat-select").value;

    fetch('https://opentdb.com/api.php?amount=' + numberOfQuestions + '&category=' + questionCategory + '&difficulty=' + level + '&type=' + 'multiple')
        .then(function (response) {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })
        .then(function (data) {
            localStorage.setItem('quizQuestions', JSON.stringify(data.results));
            window.location.href = 'quiz.html';
        })
        .catch(function (error) {
            displayError(error);
        });
});

function displayError(error) {
    var questionElement = document.getElementById('error-block');
    questionElement.innerHTML = '<p>Error: ' + error.message + '</p>';
}