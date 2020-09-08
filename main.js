(function() {
    const element = {
        score: document.querySelector('.score'),
        start: document.querySelector('.start'),
        area: document.querySelector('.area')
    };

    element.score.addEventListener('click', startGame);
    document.addEventListener('keydown', accelerate);
    document.addEventListener('keyup', stop);

    function startGame() {
        element.start.classList.add('hide');
    }

    function accelerate(event) {
        event.preventDefault();
    }

    function stop(event) {
        event.preventDefault();
    }
}());
