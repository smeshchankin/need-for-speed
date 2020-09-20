(function() {
    const element = {
        score: document.querySelector('.score'),
        start: document.querySelector('.start'),
        area: document.querySelector('.area'),
        car: document.createElement('div'),
        line: function(id, offsetLeft) {
            const line = document.createElement('div');
            definePropertyY(line);
            line.classList.add('line');
            if (offsetLeft) {
                line.style.left = offsetLeft + 'px';
            }
            line.y = (150 + 50) * id;

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
        traffic: 3,
        car: { x: 0, y: 0, maxX: 0, maxY: 0 }
    };

    const carImages = ['nioubiteul', 'pigeau', 'sapuar'];

    const totalLines = Math.ceil(element.area.offsetHeight / (150 + 50));
    const totalCars = 3;

    element.car.classList.add('car');

    element.start.addEventListener('click', startGame);
    document.addEventListener('keydown', accelerate);
    document.addEventListener('keyup', stop);

    function startGame() {
        drawRoadMarkings();
        drawEnemyCars();

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
            moveEnemyCars();

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
            for (let offset = 1; offset < 4; ++offset) {
                element.area.appendChild(element.line(id, offset * 75 - 5));
            }
        }
    }

    function drawEnemyCars() {
        for (let i = 0; i < totalCars; ++i) {
            const enemy = document.createElement('div');
            definePropertyY(enemy);
            enemy.classList.add('enemy');
            enemy.y = -100 * settings.traffic * (i + 1);
            const car = carImages[random(0, 2)];
            enemy.style.background = 'transparent url(\'img/' + car + '.png\') center / cover no-repeat';
            element.area.appendChild(enemy);

            const maxPositionX = element.area.offsetWidth - enemy.offsetWidth;
            enemy.style.left = random(0, 3) * 75 + (75 - enemy.offsetWidth) / 2 + 'px';
            enemy.speed = random(0, settings.speed);
        }
    }

    function moveRoad() {
        const lines = document.querySelectorAll('.line');
        lines.forEach(function(line) {
            line.y += settings.speed;
            if (line.y > element.area.offsetHeight) {
                line.y -= (totalLines + 1) * (150 + 50);
            }
        });
    }

    function moveEnemyCars() {
        const enemies = document.querySelectorAll('.enemy');
        enemies.forEach(function(enemy) {
            enemy.y += enemy.speed;
            if (enemy.y > element.area.offsetHeight) {
                enemy.y -= (totalCars + 1) * (150 + 50);
                const car = carImages[random(0, 2)];
                enemy.style.background = 'transparent url(\'img/' + car + '.png\') center / cover no-repeat';

                const maxPositionX = element.area.offsetWidth - enemy.offsetWidth;
                enemy.style.left = random(0, 3) * 75 + (75 - enemy.offsetWidth) / 2 + 'px';
                enemy.speed = random(0, settings.speed);
            }
        });
    }

    function definePropertyY(obj) {
        Object.defineProperty(obj, 'y', { 
            set: function(y) {
                this._y = y;
                this.style.top = y + 'px';
            },
            get: function() {
                return this._y;
            }
        });
    }

    function random(minValue, maxValue) {
        return minValue + Math.floor(Math.random() * (maxValue - minValue + 1));
    }
}());
