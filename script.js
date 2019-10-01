var lastClicked;
var count = 0;
var turn = document.querySelector("span[id='turn']");
var stringTurn = "red";
var board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]];

var grid = clickableGrid(6, 7, function (el, col) {
    var entireCol = document.querySelectorAll(`td[data-col='${col}']`);
    for (var r = entireCol.length - 1; r >= 0; --r) {
        if (entireCol[r].id == "") {
            if (count % 2 == 0) {
                entireCol[r].id = 'red';
                count++;
                turn.innerText = "YELLOW";
                stringTurn = "yellow";
            } else {
                entireCol[r].id = 'yellow';
                count++;
                turn.innerText = "RED";
                stringTurn = "red";
            }
            break;
        }
    }
});

document.getElementById("master").appendChild(grid);


function convertGridToBoard() {
    for (var row = 0; row < 6; ++row) {
        for (var col = 0; col < 7; ++col) {
            if (document.querySelector(`tr[data-row='${row}'] td[data-col='${col}']`).id == "red") {
                board[row][col] = 1;
            } else if (document.querySelector(`tr[data-row='${row}'] td[data-col='${col}']`).id == "yellow") {
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
        alert("red win");
    } else if (winner == 2) {
        alert("yellow win");
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
