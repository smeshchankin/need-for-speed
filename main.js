(function() {
    const element = {
        score: document.querySelector('.score'),
        start: document.querySelector('.start'),
        area: document.querySelector('.area'),
        car: document.createElement('div'),
        line: function(id) {
            const line = document.createElement('div');
            line.classList.add('line');
            line.y = (150 + 50) * id;
            line.style.top = line.y + 'px';
            return line;
        }
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
        car: { x: 0, y: 0, maxX: 0, maxY: 0 }
    };

    const totalLines = Math.ceil(element.area.offsetHeight / (150 + 50));

    element.car.classList.add('car');

    element.start.addEventListener('click', startGame);
    document.addEventListener('keydown', accelerate);
    document.addEventListener('keyup', stop);

    function startGame() {
        drawRoadMarkings();

        element.start.classList.add('hide');
        element.area.appendChild(element.car);

        settings.start = true;
        settings.car.x = element.car.offsetLeft;
        settings.car.y = element.car.offsetTop;
        settings.car.maxX = element.area.offsetWidth - element.car.offsetWidth;
        settings.car.maxY = element.area.offsetHeight - element.car.offsetHeight;

        requestAnimationFrame(playGame);
    }

    function playGame() {
        if (settings.start) {
            moveRoad();

            if (keys.ArrowLeft) {
                settings.car.x -= settings.speed;
            }
            if (keys.ArrowRight) {
                settings.car.x += settings.speed;
            }
            if (keys.ArrowUp) {
                settings.car.y -= settings.speed;
            }
            if (keys.ArrowDown) {
                settings.car.y += settings.speed;
            }

            settings.car.x = Math.min(settings.car.x, settings.car.maxX);
            settings.car.x = Math.max(settings.car.x, 0);
            settings.car.y = Math.min(settings.car.y, settings.car.maxY);
            settings.car.y = Math.max(settings.car.y, 0);

            element.car.style.left = settings.car.x + 'px';
            element.car.style.top = settings.car.y + 'px';

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

    function drawRoadMarkings() {
        for (let id = 0; id < totalLines + 1; ++id) {
            element.area.appendChild(element.line(id));
        }
    }

    function moveRoad() {
        const lines = document.querySelectorAll('.line');
        lines.forEach(function(line) {
            line.y += settings.speed;
            if (line.y > element.area.offsetHeight) {

                line.y -= (totalLines + 1) * (150 + 50);
            }
            line.style.top = line.y + 'px';
        });
    }
}());
