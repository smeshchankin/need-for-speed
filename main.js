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
        speed: 3,
        car: { maxX: 0, maxY: 0 }
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
        settings.car.maxX = element.area.offsetWidth - element.car.offsetWidth;
        settings.car.maxY = element.area.offsetHeight - element.car.offsetHeight;

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

            settings.x = Math.min(settings.x, settings.car.maxX);
            settings.x = Math.max(settings.x, 0);
            settings.y = Math.min(settings.y, settings.car.maxY);
            settings.y = Math.max(settings.y, 0);

            element.car.style.left = settings.x + 'px';
            element.car.style.top = settings.y + 'px';

            requestAnimationFrame(playGame);
        }
    }

    function accelerate(event) {
        if (keys[event.key] !== undefined) {
            event.preventDefault();
            keys[event.key] = true;
        }
    }

    function stop(event) {
        if (keys[event.key] !== undefined) {
            event.preventDefault();
            keys[event.key] = false;
        }
    }
}());
