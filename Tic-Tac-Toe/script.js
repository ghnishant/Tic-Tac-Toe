let gameMode = "computer";
let lastMoveCell = null;

function showRules() {
    alert("Rules:\n- The game is played on a 3x3 grid.\n- Players take turns placing their mark (X or O) in an empty cell.\n- The first player to align three marks in a row, column, or diagonal wins.\n- If all cells are filled and no player has won, it's a draw.");
}

function selectMode(mode) {
    gameMode = mode;
    resetGame();
}

const board = document.getElementById("board");
let currentPlayer = "X";
let cells = Array(9).fill(null);

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            alert(`${cells[a]} Wins!`);
            resetGame();
            return;
        }
    }
    if (!cells.includes(null)) {
        alert("It's a Draw!");
        resetGame();
    }
}

function handleClick(index) {
    if (!cells[index]) {
        cells[index] = currentPlayer;
        const cell = document.getElementById(index);
        cell.classList.add(currentPlayer.toLowerCase()); 
        cell.classList.add("taken");

       
        if (cells.filter(cell => cell !== null).length === 9) {
            cell.classList.add("last-move");
        }

        checkWinner();
        currentPlayer = currentPlayer === "X" ? "O" : "X";

        if (gameMode === "computer" && currentPlayer === "O") {
            setTimeout(bestMove, 500);
        }
    }
}

function bestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (!cells[i]) {
            cells[i] = "O";
            let score = minimax(cells, 0, false);
            cells[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    if (move !== undefined) {
        handleClick(move);
    }
}

function minimax(cells, depth, isMaximizing) {
    const scores = {
        X: -1,
        O: 1,
        draw: 0
    };

    const result = checkWinnerForMinimax();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (!cells[i]) {
                cells[i] = "O";
                let score = minimax(cells, depth + 1, false);
                cells[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (!cells[i]) {
                cells[i] = "X";
                let score = minimax(cells, depth + 1, true);
                cells[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinnerForMinimax() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            return cells[a];
        }
    }
    if (!cells.includes(null)) {
        return "draw";
    }
    return null;
}

function resetGame() {
    cells.fill(null);
    board.innerHTML = "";
    createBoard();
    currentPlayer = "X";
    lastMoveCell = null; 
}

function createBoard() {
    cells.forEach((_, index) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.id = index;
        cell.addEventListener("click", () => handleClick(index));
        board.appendChild(cell);
    });
}

function toggleTheme() {
    const body = document.body;
    if (body.classList.contains("light-theme")) {
        body.classList.remove("light-theme");
        body.classList.add("dark-theme");
    } else {
        body.classList.remove("dark-theme");
        body.classList.add("light-theme");
    }
}

createBoard();