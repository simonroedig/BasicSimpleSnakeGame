var score = 0;
var clickedHelp = false;

function showHelp() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    if (clickedHelp == false) {
        ctx.fillStyle = "white";
        ctx.font = "400 20px Fredoka";
        ctx.fillText("- Press 'Enter', 'Space', or Button to start/end game -", canvas.width / 2, canvas.height * 0.60);
        ctx.fillText("- Use 'Arrow Keys' to move snake -", canvas.width / 2, canvas.height * 0.65);
        clickedHelp = true;

    } else {
        ctx.fillStyle = "#15202B";
        ctx.fillRect(0, canvas.height / 2 + 20, canvas.width, canvas.height / 4);
        clickedHelp = false;
    }
}

function main() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    let canvasS = document.getElementsByTagName("canvas")[0];

    canvasS.width = 650;
    canvasS.height = 650;

    ctx.fillStyle = "#15202B";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "600 35px Fredoka";

    ctx.textAlign = "center";
    ctx.fillText("Simon's Snake Game", canvas.width / 2, canvas.height / 2);

    document.getElementById("help").addEventListener("click", showHelp);

    document.getElementById("start").addEventListener("click", startGame);
    document.body.onkeyup = function(e){
        if(e.keyCode == 32 || e.keyCode == 13){
            startGame();
        }
    }
    if (localStorage.getItem('highscore') == null) {
        window.localStorage.setItem('highscore', 0);
    }
    if (localStorage.getItem('score') == null) {
        window.localStorage.setItem('score', 0);
    }
    document.getElementById("highscore").innerHTML = "Highscore: " + localStorage.getItem('highscore');
    document.getElementById("score").innerHTML = "Score: " + localStorage.getItem('score');

}

function startGame() {

    document.getElementById("start").addEventListener("click", refreshPage);
    document.getElementById("start").style.backgroundColor = "#F10086";
    document.getElementById("start").innerHTML = "End";

    document.body.onkeyup = function(e){
        if(e.keyCode == 32 || e.keyCode == 13){
            refreshPage();
        }
    }


    window.localStorage.setItem('score', score);
    document.getElementById("score").innerHTML = "Score: " + localStorage.getItem('score');


    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    let rows = 24;
    let cols = 24;

    let gapSize = 5;

    let snake = [{x: rows / 2, y: rows / 2}];
    let food;
    randomFoodPlace();
    let foodCollected = false;

    let cellWidth = canvas.width / cols;
    let cellHeight = canvas.height / rows;

    let direction = randDirection();

    setInterval(gameLoop, 100);

    document.addEventListener("keydown", arrowKey);

    draw();

    function draw() {
        ctx.fillStyle = "#15202B";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //SNAKE
        ctx.fillStyle = "#6EDCD9";
        snake.forEach(part => add(part.x, part.y));

        //FOOD
        ctx.fillStyle = "#F10086";
        add(food.x, food.y);

        requestAnimationFrame(draw);
    }

    function add(x, y) {
        ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth - gapSize, cellHeight - gapSize);
    }

    function shiftSnake() {
        for (let i = snake.length - 1; i > 0; i--) {
            const part = snake[i];
            const lastPart = snake[i - 1];
            part.x = lastPart.x;
            part.y = lastPart.y;
        }
    }

    function gameLoop() {
        gameOver();
        if (foodCollected) {
            snake = [{x: snake[0].x, y: snake[0].y}, ...snake];
            document.getElementById("score").innerHTML = "Score: " + score;
            foodCollected = false;
        }
        shiftSnake();
        switch(direction) {
            case "LEFT":
                snake[0].x--;
                break;
            case "UP":
                snake[0].y--;
                break;
            case "RIGHT":
                snake[0].x++;
                break;
            case "DOWN":
                snake[0].y++;
                break;
        }
        if (snake[0].x == food.x && snake[0].y == food.y) {
            score++;
            if (localStorage.getItem('highscore') <= score) {
                window.localStorage.setItem('highscore', score);
            }
            foodCollected = true;
            randomFoodPlace();
        }
    }

    function arrowKey(e) {
        switch(e.keyCode) {
            case 37:
                if(direction != "RIGHT") {
                    direction = "LEFT";
                }
                break;
            case 38:
                if(direction != "DOWN") {
                    direction = "UP";
                }
                break;
            case 39:
                if(direction != "LEFT") {
                    direction = "RIGHT";
                }
                break;
            case 40:
                if(direction != "UP") {
                    direction = "DOWN";
                }
                break;
        }
    }

    function randomFoodPlace() {
        let randomX = Math.floor(Math.random() * cols);
        let randomY = Math.floor(Math.random() * rows);

        food = {x: randomX, y: randomY};
    }

    function gameOver() {
        let firstPart = snake[0];
        let otherParts = snake.slice(1);
        let hitSelf = otherParts.find(part => part.x == firstPart.x && part.y == firstPart.y);

        if (snake[0].x < 0 || snake[0].x > cols - 1 || snake[0].y < 0 || snake[0].y > rows - 1 || hitSelf) {
            window.localStorage.setItem('score', score);
            refreshPage();
        }
    }

    function randDirection() {
        let num = Math.floor(Math.random() * 4);
        let dirArr = ["LEFT", "RIGHT", "UP", "DOWN"];
        return dirArr[num];
    }
}

function refreshPage(){
    window.localStorage.setItem('score', score);
    window.location.reload();
}
