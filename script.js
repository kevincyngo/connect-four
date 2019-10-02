const playerTurn = {
    red: "red",
    yellow: "yellow"
}

//Default values
const DEFAULT_COUNT = 0;
const DEFAULT_STRING_TURN = playerTurn.red;
const DEFAULT_BOARD = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]];

//Initialization
var lastClicked;
var count = DEFAULT_COUNT;
var turn = document.querySelector("span[id='turn']");
var stringTurn = DEFAULT_STRING_TURN;
var board = DEFAULT_BOARD;

function convertGridToBoard() {
    for (var row = 0; row < 6; ++row) {
        for (var col = 0; col < 7; ++col) {
            if (document.querySelector(`tr[data-row='${row}'] td[data-col='${col}']`).id == playerTurn.red) {
                board[row][col] = 1;
            } else if (document.querySelector(`tr[data-row='${row}'] td[data-col='${col}']`).id == playerTurn.yellow) {
                board[row][col] = 2;
            }
        }
    }
}

function chkLine(a, b, c, d) {
    // Check first cell non-zero and all cells match
    return ((a != 0) && (a == b) && (a == c) && (a == d));
}

function chkWinner(bd) {
    // Check down
    for (r = 0; r < 3; r++)
        for (c = 0; c < 7; c++)
            if (chkLine(bd[r][c], bd[r + 1][c], bd[r + 2][c], bd[r + 3][c]))
                return bd[r][c];

    // Check right
    for (r = 0; r < 6; r++)
        for (c = 0; c < 4; c++)
            if (chkLine(bd[r][c], bd[r][c + 1], bd[r][c + 2], bd[r][c + 3]))
                return bd[r][c];

    // Check down-right
    for (r = 0; r < 3; r++)
        for (c = 0; c < 4; c++)
            if (chkLine(bd[r][c], bd[r + 1][c + 1], bd[r + 2][c + 2], bd[r + 3][c + 3]))
                return bd[r][c];

    // Check down-left
    for (r = 3; r < 6; r++)
        for (c = 0; c < 4; c++)
            if (chkLine(bd[r][c], bd[r - 1][c + 1], bd[r - 2][c + 2], bd[r - 3][c + 3]))
                return bd[r][c];

    return 0;
}

function winCheck() {
    var winner = chkWinner(board);
    if (winner == 1) {
        alert("RED WINS");
    } else if (winner == 2) {
        alert("YELLOW WINS");
    }
    if (winner > 0) {
        reset();
    }
}

function removeHover() {
    for (var cell of document.querySelectorAll("td[id*='hover']")) {
        cell.id = "";
    }
}

function toggleHover(e, toggle) {
    var cells = document.querySelectorAll(`td[data-col='${e.target.dataset.col}']`);
    for (var r = 5; r >= 0; --r) {
        if (toggle) {
            if (cells[r].id == "") {
                cells[r].id = "hover-" + stringTurn;
                break;
            }
        } else {
            var cells = document.querySelectorAll(`td[data-col='${e.target.dataset.col}']`);
            for (var r = 5; r >= 0; --r) {
                if (cells[r].id == `hover-${stringTurn}`) {
                    cells[r].id = "";
                    break;
                }
            }
        }
    }
}

function clickableGrid(rows, cols, callback) {
    var grid = document.createElement('table');
    grid.className = 'grid';
    for (var r = 0; r < rows; ++r) {
        var tr = document.createElement('tr');
        tr.setAttribute("data-row", r);
        grid.appendChild(tr);
        for (var c = 0; c < cols; ++c) {
            var cell = document.createElement('td');
            cell.setAttribute("data-col", c);
            cell.addEventListener('click', (function (el, c) {
                return function (el) {
                    removeHover();
                    callback(el, c);
                    convertGridToBoard();
                    winCheck();
                    toggleHover(el, true);
                }
            })(cell, c), false);
            tr.appendChild(cell);

            cell.addEventListener('mouseover', function (e) {
                toggleHover(e, true);
            });

            cell.addEventListener('mouseout', function (e) {
                toggleHover(e, false);
            });
        }
    }
    return grid;
}

function setDisplay(bool) {
    if (bool) {
        document.querySelector("#gamePrompt").setAttribute("hidden", true);
        document.querySelector("#master").removeAttribute("hidden");
    }
    else {
        document.querySelector("#gamePrompt").removeAttribute("hidden");
        document.querySelector("#master").setAttribute("hidden", true);
    }
}

function isPlaying() {
    setDisplay(true);
    var grid = clickableGrid(6, 7, function (el, col) {
        var entireCol = document.querySelectorAll(`td[data-col='${col}']`);
        for (var r = entireCol.length - 1; r >= 0; --r) {
            if (entireCol[r].id == "") {
                if (count % 2 == 0) {
                    entireCol[r].id = playerTurn.red;
                    count++;
                    turn.setAttribute("data-turn", playerTurn.yellow);
                    turn.innerText = playerTurn.yellow.toUpperCase();
                    stringTurn = playerTurn.yellow;
                } else {
                    entireCol[r].id = playerTurn.yellow;
                    count++;
                    turn.setAttribute("data-turn", playerTurn.red);
                    turn.innerText = playerTurn.red.toUpperCase();
                    stringTurn = playerTurn.red;
                }
                break;
            }
        }
    });
    document.getElementById("master").appendChild(grid);
}

function reset() {
    var usedCells = document.querySelectorAll("td#yellow");
    for (cell of usedCells) {
        cell.id = "";
    }
    usedCells = document.querySelectorAll("td#red");
    for (cell of usedCells) {
        cell.id = "";
    }
    setDisplay(false);
    board = DEFAULT_BOARD;
    count = DEFAULT_COUNT;
    stringTurn = DEFAULT_STRING_TURN;

}

//TODO: convertGridToBoard is being called after every click and it is running in a for loop
//To fix - pass in row and col to convert (can be done in constant time)