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
        turnStep: 3,
        speed: 3,
        traffic: 3,
        car: { x: 0, y: 0, maxX: 0, maxY: 0 }
    };

    const touch = {
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 }
    }

    const carImages = ['nioubiteul', 'pigeau', 'sapuar'];

    const totalLines = Math.ceil(element.area.offsetHeight / (150 + 50));
    const totalCars = 3;

    element.car.classList.add('car');

    element.start.addEventListener('click', startGame);
    document.addEventListener('keydown', accelerate);
    document.addEventListener('keyup', stop);

    document.addEventListener('touchstart', function(event) {
        let data = event.changedTouches[0];
        touch.start = { x: data.screenX, y: data.screenX };
        touch.end = { x: data.screenX, y: data.screenX };
    }, false);
    document.addEventListener('touchend', function(event) {
        let data = event.changedTouches[0];
        touch.end = { x: data.screenX, y: data.screenX };
    }, false);

    function startGame() {
        element.area.innerHTML = '';

        drawRoadMarkings();
        drawEnemyCars();

        element.start.classList.add('hide');
        element.area.appendChild(element.car);
        element.car.style.left = (element.area.offsetWidth - element.car.offsetWidth) / 2;
        element.car.style.top = 'auto';

        settings.score = 0;
        settings.speed = 3;
        settings.traffic = 3;
        settings.start = true;
        settings.car.x = element.car.offsetLeft;
        settings.car.y = element.car.offsetTop;
        settings.car.maxX = element.area.offsetWidth - element.car.offsetWidth;
        settings.car.maxY = element.area.offsetHeight - element.car.offsetHeight;

        requestAnimationFrame(playGame);
    }

    function playGame() {
        if (settings.start) {
            settings.speed = Math.floor(settings.score / 10000) + 3;
            if (settings.traffic < Math.floor(settings.score / 5000) + 3) {
                console.log('Add new enemy car');
                ++settings.traffic;
                addEnemyCar();
            }

            settings.score += settings.speed;
            element.score.innerHTML = 'SCORE:<br />' + settings.score;

            moveRoad();
            moveEnemyCars();

            if (keys.ArrowLeft) {
                settings.car.x -= settings.turnStep;
            }
            if (keys.ArrowRight) {
                settings.car.x += settings.turnStep;
            }
            if (keys.ArrowUp) {
                settings.car.y -= settings.speed;
            }
            if (keys.ArrowDown) {
                settings.car.y += settings.speed;
            }

            if (touch.start.x != touch.end.x) {
                settings.car.x += touch.end.x - touch.start.x;
                touch.start.x = touch.end.x;
            }
            if (touch.start.y != touch.end.y) {
                settings.car.y += touch.end.y - touch.start.y;
                touch.start.y = touch.end.y;
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
            addEnemyCar();
        }
    }

    function addEnemyCar() {
        const enemy = document.createElement('div');
            definePropertyY(enemy);
            enemy.classList.add('enemy');

            resetEnemyCar(enemy, true);
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
        const carRect = element.car.getBoundingClientRect();

        const enemies = document.querySelectorAll('.enemy');
        enemies.forEach(function(enemy) {
            const enemyRect = enemy.getBoundingClientRect();
            if (isAccident(element.car, enemy)) {
                settings.start = false;
                element.start.classList.remove('hide');
                element.start.style.top = element.score.offsetHeight;
            }

            enemy.y += enemy.speed;
            if (enemy.y > element.area.offsetHeight) {
                resetEnemyCar(enemy, false);
            }
        });
    }

    function resetEnemyCar(enemy, appendCar) {
        const car = carImages[random(0, 2)];
        enemy.style.background = 'transparent url(\'img/' + car + '.png\') center / cover no-repeat';
        if (appendCar) {
            element.area.appendChild(enemy);
        }

        enemy.y = -enemy.offsetHeight - 50;
        const laneWidth = element.area.offsetWidth / 4;
        enemy.style.left = random(0, 3) * laneWidth + (laneWidth - enemy.offsetWidth) / 2 + 'px';
        enemy.speed = random(1, settings.speed - 1);
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

    function isAccident(car1, car2) {
        const rect = [car1.getBoundingClientRect(), car2.getBoundingClientRect()];
        return rect[0].top <= rect[1].bottom && rect[1].top <= rect[0].bottom &&
            rect[0].left <= rect[1].right && rect[1].left <= rect[0].right;
    }
}());
