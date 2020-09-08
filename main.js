(function() {
    const element = {
        score: document.querySelector('.score'),
        start: document.querySelector('.start'),
        area: document.querySelector('.area')
    };

    const keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowRight: false,
        ArrowLeft: false
    };

    const settings = {
        start: false,
        score: 0,
        speed: 3
    };

    element.score.addEventListener('click', startGame);
    document.addEventListener('keydown', accelerate);
    document.addEventListener('keyup', stop);

    function startGame() {
        element.start.classList.add('hide');
        settings.start = true;
        requestAnimationFrame(playGame);
    }

    function playGame() {
        if (settings.start) {
            requestAnimationFrame(playGame);
        }
    }

    function accelerate(event) {
        event.preventDefault();
        keys[event.key] = true;
    }

    function stop(event) {
        event.preventDefault();
        keys[event.key] = false;
    }
}());
