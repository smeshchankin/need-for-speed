(function() {
    const element = {
        score: document.querySelector('.score'),
        start: document.querySelector('.start'),
        area: document.querySelector('.area'),
        car: document.createElement('div')
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

    element.car.classList.add('car');

    element.start.addEventListener('click', startGame);
    document.addEventListener('keydown', accelerate);
    document.addEventListener('keyup', stop);

    function startGame() {
        element.start.classList.add('hide');
        element.area.appendChild(element.car);

        settings.start = true;
        settings.x = element.car.offsetLeft;
        settings.y = element.car.offsetTop;

        requestAnimationFrame(playGame);
    }

    function playGame() {
        if (settings.start) {
            if (keys.ArrowLeft) {
                settings.x -= settings.speed;
            }
            if (keys.ArrowRight) {
                settings.x += settings.speed;
            }
            if (keys.ArrowUp) {
                settings.y -= settings.speed;
            }
            if (keys.ArrowDown) {
                settings.y += settings.speed;
            }

            element.car.style.left = settings.x;
            element.car.style.top = settings.y;

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
