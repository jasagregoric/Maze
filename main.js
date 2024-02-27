let path = [
    "#################################",
    "#...#...............#...........#",
    "###.#.#############.#.#########.#",
    "#...#.#.........#.#.#...#.....#.#",
    "#.###.#.#####.#.#.#.#.#.###.###.#",
    "#.....#...#.#.#...#.#.#...#.....#",
    "#########.#.#.###.#.#.###.#.#####",
    "#....K#.....#.#.#.#.#P#...#.....#",
    "#.#####.#####.#.#.#.###.#######.#",
    "#.....#.#.....#...#...#.#.#.....#",
    "#####.#.#.#####.#####.#.#.#.#####",
    "#.....#.#.#...#.#...#.#.#...#...#",
    "#.#####.#.#.#.#.#.#.#.#.#.###.#.#",
    "#.#.....#.#.#.#.#.#.#...#.....#.#",
    "#.#.#####.###.#.#.#.###########.#",
    "#.#...#.#...#...#.#.......#.#...#",
    "#.###.#.###.#####.###.###.#.#.###",
    "#...#.....#...#.....#...#.#.#.#.#",
    "#.#######.###.#.#######.#.#.#.#.#",
    "#.......#...#...#...#...#...#...#",
    "#####.#.###.#####.#.#.###.#####.#",
    "#.....#...#.#.....#...#...#...#.#",
    "#.#########.#.#############.#.#.#",
    "#...........#...............#...D",
    "#################################"
]

const tile = document.getElementById("tile");
const wall = document.getElementById("path");
const m = document.getElementById("man");
const door = document.getElementById("door");
const key = document.getElementById("key");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var backgroundMusic = document.getElementById('backgroundMusic');
var backgroundMusic2 = document.getElementById('backgroundMusic2');
var backgroundMusic3 = document.getElementById('backgroundMusic3');
var backgroundMusic4 = document.getElementById('backgroundMusic4');
var doorChk = document.getElementById('doorChk');
var keyChk = document.getElementById('keyChk');
var exti = document.getElementById('exit');
var restart = document.getElementById('restart');
var how = document.getElementById('how');
var score = document.getElementById('score');
var btn = document.getElementById('btn');
var howTo = document.getElementById('howtoplay');
var tabBtn = document.getElementById('tabBtn');
var sco= document.getElementById('sco');

var playerX=21;
var playerY=7;

var hasKey = false;
var hasChecked = false;

var played = false;

var startTime;
var endTime;
var time;
var score;
var player;


document.addEventListener("DOMContentLoaded", function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    map();
});

restart.addEventListener("click", function(){
    location.reload();
});

how.addEventListener("click", function(){
    howTo.style.visibility="visible";
    restart.disabled = true;
    how.disabled = true;
    score.disabled = true;
});

btn.addEventListener("click", function(){
    howTo.style.visibility="hidden";
    restart.disabled = false;
    how.disabled = false;
    score.disabled = false;
});

score.addEventListener("click", function(){
    const storedDataString = localStorage.getItem("playerData");
    sco.style.visibility="visible";
    if (storedDataString) {
        const storedData = JSON.parse(storedDataString);
        storedData.sort((a, b) => b.score - a.score);
        generateTable(storedData);
    }
    restart.disabled = true;
    how.disabled = true;
    score.disabled = true;
});

tabBtn.addEventListener("click", function(){
    sco.style.visibility="hidden";
    restart.disabled = false;
    how.disabled = false;
    score.disabled = false;
});

document.addEventListener("keydown", (e) => {
    const key=e.key;
    
    switch(key){
        case "w":
        case "W":
        case "ArrowUp":
            if(path[playerY-1][playerX]=="."){
                path[playerY]=rep(playerX, ".", path[playerY]);
                path[playerY-1]=rep(playerX, "P", path[playerY-1]);
                playerY--;
                map();
            }
            if(played==false ){
                backgroundMusic.play();
                played = true;
                startTime = performance.now();
            }
            break;
        case "s":
        case "S":
        case "ArrowDown":
            if(path[playerY+1][playerX]=="."){
                path[playerY]=rep(playerX, ".", path[playerY]);
                path[playerY+1]=rep(playerX, "P", path[playerY+1]);
                playerY++;
                map();
            }
            if(played==false ){
                backgroundMusic.play();
                played = true;
                startTime = performance.now();
            }
            break;
        case "d":
        case "D":
        case "ArrowRight":
            if(played==false ){
                backgroundMusic.play();
                played = true;
                startTime = performance.now();
            }
            if(path[playerY][playerX+1]=="."){
                path[playerY]=rep(playerX, ".", path[playerY]);
                path[playerY]=rep(playerX+1, "P", path[playerY]);
                playerX++;
                map();
            }
            else if(path[playerY][playerX+1]=="K"){
                hasKey = true;
                path[playerY]=rep(playerX, ".", path[playerY]);
                path[playerY]=rep(playerX+1, "P", path[playerY]);
                playerX++;
                map();
                backgroundMusic2.volume = 0.7;
                backgroundMusic2.play();
                keyChk.style.textDecoration="line-through";
                keyChk.style.textDecorationThickness="2px";
                setTimeout(() => {
                    exit.style.visibility="visible";
                }, 2000);
            }
            else if(path[playerY][playerX+1]=="D"){
                if(hasKey==true){
                    path[playerY]=rep(playerX, ".", path[playerY]);
                    path[playerY]=rep(playerX+1, "P", path[playerY]);
                    playerX++;
                    map();
                    endTime = performance.now();
                    time=endTime-startTime;
                    score=(600000 - time) / (600000 - 10000) * 1000;
                    score=score.toFixed(0);
                    console.log(score);
                    backgroundMusic4.play();
                    exit.style.textDecoration="line-through";
                    exit.style.textDecorationThickness="2px";
                    enterName().then((result) => {
                        if (result.isConfirmed) {
                            player = result.value || 'Player';
                            console.log(player);
                            let storedDataString = localStorage.getItem("playerData");
                            let storedData = [];
                            if (storedDataString) {
                                storedData = JSON.parse(storedDataString);
                            }
                            const playerData = { name: player, score: score };
                            storedData.push(playerData);
                            storedDataString = JSON.stringify(storedData);

                            localStorage.setItem("playerData", storedDataString);

                            end();
                        }
                    });
                }
                else if(hasChecked==false){
                    hasChecked = true;
                    show();
                    backgroundMusic3.play();
                    doorChk.style.textDecoration="line-through";
                    doorChk.style.textDecorationThickness="2px";
                    setTimeout(() => {
                        keyChk.style.visibility="visible";
                    }, 2000);
                    
                }
            }
            break;
        case "a":
        case "A":
        case "ArrowLeft":
            if(path[playerY][playerX-1]=="."){
                path[playerY]=rep(playerX, ".", path[playerY]);
                path[playerY]=rep(playerX-1, "P", path[playerY]);
                playerX--;
                map();
            }
            if(played==false ){
                backgroundMusic.play();
                played = true;
                startTime = performance.now();
            }
            break;
    }
});

function drawLightCircle(x, y) {
    ctx.save(); // Save the current canvas state

    ctx.beginPath();
    ctx.arc(x, y, 60, 0, 2 * Math.PI, false);
    ctx.clip(); 

    drawLab();

    ctx.restore(); // Restore the previous canvas state
}

function map() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLab();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawLightCircle(playerX * 25 + 12.5, playerY * 25 + 12.5);
}

function drawLab() {
    for (let i = 0; i < path.length; i++) {
        let x = 0;
        let y = i * 25;
        for (let j = 0; j < path[i].length; j++) {
            if (path[i][j] == "#") {
                ctx.drawImage(tile, x, y);
            }else if(path[i][j]=="P"){
                ctx.drawImage(m, x, y);
            }else if(path[i][j]=="D"){
                ctx.drawImage(door, x, y);
            }else if(path[i][j]=="K"){
                ctx.drawImage(key, x, y);
            }else {
                ctx.drawImage(wall, x, y);
            }
            x = x + 25;
        }
    }
}

function end() {
    Swal.fire({
      html: '<div style="display:grid;place-items:center;margin: 50px 0"><img src="img/trophy.png"></img><div style="margin:25px; width: 60%;background-size: contain ; background-repeat: no-repeat; display: grid;"></div></div ><div class="box"><a style="font-size:25px; color: rgba(38, 36, 36, 0.95); font-weight: 600; margin-top: -10%;"><h1>Victory</h1><br>Congratulations you escaped the maze!</a></div>',
      background:
        "url(img/bac.jpg)",
      confirmButtonColor: "rgba(38, 36, 36, 0.95)",
      text: "",
    }).then(() => {
        location.reload();
    });
  }

function show(){
    var image = document.getElementById('paper');

    image.style.display = 'block';

    setTimeout(function() {
        image.style.display = 'none';
    }, 4000);
}

function rep(index, replacement, string) {
    return string.substring(0, index) + replacement + string.substring(index+1, string.length);
}

function enterName() {
    return Swal.fire({
        title: 'Enter your name:',
        input: 'text',
        inputPlaceholder: 'Your name',
        confirmButtonText: 'Submit',
        background: "url(img/bac.jpg)",
        confirmButtonColor: "rgba(38, 36, 36, 0.95)"
    });
}

function generateTable(sortedData) {
    const tableBody = document.getElementById("scoreTable");
    tableBody.innerHTML = "";

    const row2 = document.createElement("tr");
    row2.setAttribute("id", "mainTr");

    const rankCell2 = document.createElement("td");
    rankCell2.textContent = "Rank";
    const nameCell2 = document.createElement("td");
    nameCell2.textContent = "Name";
    const scoreCell2 = document.createElement("td");
    scoreCell2.textContent = "Score";

    row2.appendChild(rankCell2);
    row2.appendChild(nameCell2);
    row2.appendChild(scoreCell2);

    tableBody.appendChild(row2);

    sortedData.forEach((playerData, index) => {

        const row = document.createElement("tr");
        row.classList.add("row");

        const rankCell = document.createElement("td");
        rankCell.textContent = index + 1;
        const nameCell = document.createElement("td");
        nameCell.textContent = playerData.name;
        const scoreCell = document.createElement("td");
        scoreCell.textContent = playerData.score;

        row.appendChild(rankCell);
        row.appendChild(nameCell);
        row.appendChild(scoreCell);

        tableBody.appendChild(row);
    });
}