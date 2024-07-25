let gameBoard = [];
let currentPlayer = "X";
let gameMode = "single";
let gameOver = false;
let player1Wins = 0;
let player2Wins = 0;

function initializeBoard() {
    gameBoard = [];
    for (let i = 0; i < 3; i++) {
        gameBoard.push([]);
        for (let j = 0; j < 3; j++) {
            gameBoard[i].push(" ");
            const cellElement = document.getElementById(`cell-${i}-${j}`);
            cellElement.innerText = "";
            cellElement.classList.remove("x", "o");
            cellElement.style.background = "none";
            cellElement.addEventListener("click", () => {
                if (!gameOver && (gameMode === "multi" || currentPlayer === "X")) {
                    makeMove(i, j);
                }
            });
        }
    }
    updateTurnIndicator();
}

document.getElementById("single-player-btn").addEventListener("click", () => {
    gameMode = "single";
    document.getElementById("player1-wins").innerText = `You Wins: ${player1Wins}`;
    document.getElementById("player2-wins").innerText = `AI Wins: ${player2Wins}`;
    startGame();
});

document.getElementById("multiplayer-btn").addEventListener("click", () => {
    gameMode = "multi";
    document.getElementById("player1-wins").innerText = `Player 1 Wins: ${player1Wins}`;
    document.getElementById("player2-wins").innerText = `Player 2 Wins: ${player2Wins}`;
    startGame();
});

document.getElementById("back-btn").addEventListener("click", () => {
    document.getElementById("mode-tab").style.display = "block";
    document.getElementById("game-tab").style.display = "none";
    document.getElementById("start-game-btn").style.display = "none";
});

document.getElementById("refresh-scoreboard-btn").addEventListener("click", () => {
    player1Wins = 0;
    player2Wins = 0;
    updateScoreboard();
});

function startGame() {
    document.getElementById("mode-tab").style.display = "none";
    document.getElementById("game-tab").style.display = "block";
    initializeBoard();
    gameOver = false;
    currentPlayer = "X";
    updateTurnIndicator();
}

function makeMove(row, col) {
    if (gameBoard[row][col] === " " && !gameOver) {
        gameBoard[row][col] = currentPlayer;
        document.getElementById(`cell-${row}-${col}`).innerText = currentPlayer;
        document.getElementById(`cell-${row}-${col}`).classList.add(currentPlayer.toLowerCase());

        if (checkWin(currentPlayer)) {
            gameOver = true;
            drawWinningLine();
            updateTurnIndicator(`${currentPlayer === "X" ? (gameMode === "single" ? "You" : "Player 1") : (gameMode === "single" ? "AI" : "Player 2")} Wins!`);
            if (currentPlayer === "X") {
                player1Wins++;
            } else {
                player2Wins++;
            }
            updateScoreboard();
            setTimeout(startGame, 1000); 
        } else if (isDraw()) {
            gameOver = true;
            updateTurnIndicator('Draw!');
            setTimeout(startGame, 1000); 
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            updateTurnIndicator();
            if (gameMode === "single" && !gameOver && currentPlayer === "O") {
                setTimeout(computerMove, 500);
            }
        }
    }
}

function computerMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (gameBoard[i][j] === " ") {
                gameBoard[i][j] = "O";
                let score = minimax(gameBoard, 0, false);
                gameBoard[i][j] = " ";
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { row: i, col: j };
                }
            }
        }
    }

    makeMove(bestMove.row, bestMove.col);
}

function minimax(board, depth, isMaximizing) {
    const scores = {
        X: -10,
        O: 10,
        draw: 0
    };

    let result = checkWin("X");
    if (result !== null) {
        return scores["X"];
    }

    result = checkWin("O");
    if (result !== null) {
        return scores["O"];
    }

    if (isDraw()) {
        return scores["draw"];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === " ") {
                    board[i][j] = "O";
                    let score = minimax(board, depth + 1, false);
                    board[i][j] = " ";
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === " ") {
                    board[i][j] = "X";
                    let score = minimax(board, depth + 1, true);
                    board[i][j] = " ";
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

function isDraw() {
    return gameBoard.every(row => row.every(cell => cell !== " "));
}

function checkWin(player) {
    const winningCombinations = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

    const winner = winningCombinations.find(combination => {
        return combination.every(([row, col]) => gameBoard[row][col] === player);
    });

    return winner || null;
}

function drawWinningLine() {
    const winningCombination = checkWin(currentPlayer);
    if (winningCombination) {
        winningCombination.forEach(([row, col]) => {
            document.getElementById(`cell-${row}-${col}`).style.background = "linear-gradient(to bottom right, #ff6f61, #ffecd2)";
        });
    }
}

function updateTurnIndicator(message) {
    const turnIndicator = document.getElementById("turn-indicator");
    if (message) {
        turnIndicator.innerText = message;
    } else if (gameMode === "single") {
        turnIndicator.innerText = currentPlayer === "X" ? "Your turn" : "AI's turn";
    } else {
        turnIndicator.innerText = currentPlayer === "X" ? "Player 1's turn" : "Player 2's turn";
    }
}

function updateScoreboard() {
    if (gameMode === "single") {
        document.getElementById("player1-wins").innerText = `You Wins: ${player1Wins}`;
        document.getElementById("player2-wins").innerText = `AI Wins: ${player2Wins}`;
    } else {
        document.getElementById("player1-wins").innerText = `Player 1 Wins: ${player1Wins}`;
        document.getElementById("player2-wins").innerText = `Player 2 Wins: ${player2Wins}`;
    }
}

document.getElementById("mode-tab").style.display = "block";
