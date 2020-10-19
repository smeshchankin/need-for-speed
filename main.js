import Music from "modules/Music.js";

(function() {
    class Road {
        constructor(selector, width, laneCount) {
            this.selector = selector;
            this.width = +width;
            this.laneCount = +laneCount;
            this._lines = [];
        }

        init() {
            const createLine = (id, offsetLeft) => {
                const line = document.createElement('div');
                definePropertyY(line);
                line.classList.add('line');
                if (offsetLeft) {
                    line.style.left = offsetLeft + 'px';
                }
                line.y = (150 + 50) * id;
    
                return line;
            };

            this.element = document.querySelector(this.selector);
            this.element.style.width = this.width + 'px';

            this._totalLines = Math.ceil(this.element.offsetHeight / (150 + 50));
            const offset = this.width / this.laneCount;
            for (let id = 0; id < totalLines + 1; ++id) {
                for (let laneId = 1; laneId < this.laneCount; ++laneId) {
                    const line = createLine(id, laneId * offset - 5);
                    this._lines.push(line);
                    this.element.append(line);
                }
            }
        }

        move() {
            this._lines.forEach(line => {
                line.y += settings.speed;
                if (line.y > element.area.offsetHeight) {
                    line.y -= (this._totalLines + 1) * (150 + 50);
                }
            });
        }
    }

    class Car {
        constructor(lane, color, image) {
            this.lane = lane;
            this.color = color;
            this.image = image;

            const element = document.createElement('div');
            definePropertyY(element);
            element.classList.add('enemy');
            this.element = element;
        }

        setLane(lane) {
            this.lane = lane;
        }

        setPosition(x, y) {
            this.x = x;
            if (y !== undefined) {
                this.element.y = y;
            }
        }

        reset() {
            resetEnemyCar(this.element, true);
        }

        move() {
            this.element.y += this.speed;
            if (this.y > element.area.offsetHeight) {
                resetEnemyCar(this.element, false);
            }
        }
    }

    class KeyHandlers {
        constructor() {
            this._keys = {
                ArrowUp: false,
                ArrowDown: false,
                ArrowRight: false,
                ArrowLeft: false
            };
        }

        addKey(keyname) {
            this._keys[keyname] = false;
        }

        init() {
            const keyDownHandler = event => keyboardHandler(event, true);
            const keyUpHandler = event => keyboardHandler(event, false);

            function keyboardHandler(event, state) {
                if (this.keys[event.key] !== undefined) {
                    event.preventDefault();
                    this.keys[event.key] = state;
                }
            }

            document.addEventListener('keydown', keyDownHandler);
            document.addEventListener('keyup', keyUpHandler);
        }
    }

    class Game {
        constructor(road, music) {
            this.playerCar = new Car(2, 'red', 'img/sapuar.png');
            this.enemiyCars = Array.from({ length: 3 }, () => new Car(2, 'red', 'img/sapuar.png'));
            this.road = road;
            this.music = music;

            this._started = false;
        }

        start() {
            const play = () => {
                if (this._started) {
                    this.enemiyCars.forEach(enemy => enemy.move());
                    this.road.mode();

                    requestAnimationFrame(play);
                }
            };

            this._started = true;
            this.music.start();
            this.road.drawMarkings();
            this.enemyCars.forEach(emeny => emeny.reset());
            requestAnimationFrame(play);
        }

        stop() {
            this._started = false;
            this.music.pause();
        }
    }

    const game = new Game(
        new Road('.area', 300, 4),
        new Music('audio/race.mp3')
    );

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
        laneCount: 4,
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

    const music = new Music('audio/race.mp3');

    element.car.classList.add('car');

    element.start.addEventListener('click', startGame);
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    document.addEventListener('touchstart', function(event) {
        let data = event.changedTouches[0];
        touch.start = { x: data.screenX, y: data.screenY };
        touch.end = { x: data.screenX, y: data.screenY };
    }, false);
    document.addEventListener('touchend', function(event) {
        let data = event.changedTouches[0];
        touch.end = { x: data.screenX, y: data.screenY };
    }, false);

    function startGame() {
        element.area.innerHTML = '';
        music.play();

        drawRoadMarkings();
        drawEnemyCars();

        element.start.classList.add('hide');
        element.area.append(element.car);
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

            settings.car.x = Math.max(Math.min(settings.car.x, settings.car.maxX), 0);
            settings.car.y = Math.max(Math.min(settings.car.y, settings.car.maxY), 0);

            element.car.style.left = settings.car.x + 'px';
            element.car.style.top = settings.car.y + 'px';

            requestAnimationFrame(playGame);
        }
    }

    function keyDownHandler(event) {
        keyboardHandler(event, true);
    }

    function keyUpHandler(event) {
        keyboardHandler(event, false);
    }

    function keyboardHandler(event, state) {
        if (keys[event.key] !== undefined) {
            event.preventDefault();
            keys[event.key] = state;
        }
    }

    function drawRoadMarkings() {
        const offset = element.area.offsetWidth / settings.laneCount;

        for (let id = 0; id < totalLines + 1; ++id) {
            for (let laneId = 1; laneId < settings.laneCount; ++laneId) {
                element.area.append(element.line(id, laneId * offset - 5));
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

        return enemy;
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
            if (isAccident(element.car, enemy)) {
                stopGame();
            }

            enemy.y += enemy.speed;
            if (enemy.y > element.area.offsetHeight) {
                resetEnemyCar(enemy, false);
            }
        });
    }

    function stopGame() {
        music.pause();
        settings.start = false;
        element.start.classList.remove('hide');
        element.start.style.top = element.score.offsetHeight;
    }

    function resetEnemyCar(enemy, appendCar) {
        const car = carImages[random(0, carImages.length - 1)];
        enemy.style.background = 'transparent url(\'img/' + car + '.png\') center / cover no-repeat';
        if (appendCar) {
            element.area.append(enemy);
        }

        enemy.y = -enemy.offsetHeight - 50;
        const laneWidth = element.area.offsetWidth / settings.laneCount;
        enemy.style.left = random(0, settings.laneCount - 1) * laneWidth
            + (laneWidth - enemy.offsetWidth) / 2 + 'px';
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
