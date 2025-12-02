// The Game Board Module
const gameBoard = (function () {
    const rows = 3; 
    const columns = 3; 
    const board = []; 

    // Initializes or resets the game board
    const init = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = []; 
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell()); 
            }
        }
    }; 

    // Check whether the board is full
    const isFull = () => {
        const emptyCellsCount = board
            .flat()
            .filter(cell => cell.getValue() === "")
            .length;
        return emptyCellsCount === 0 ? true : false;  
    }

    // Get current state of the board
    const getBoard = () => board; 

    // Mark a cell with a player's marker
    const markCell = (row, column, player) => {
        if (isFull()) {
            console.log("Board is full! "); 
            return 2; 
        }; 
        
        const cell = board[row][column]; 
        if (cell.getValue() === "") {
            cell.mark(player); 
            return 0; 
        } else {
            console.log("Cell already marked! "); 
            return 1; 
        }
    }

    // Print the board to the console as a table
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => 
            row.map((cell) => cell.getValue())
        ); 
        console.table(boardWithCellValues); 
    }

    return { 
        init, 
        isFull, 
        getBoard, 
        markCell, 
        printBoard, 
    }; 

})(); 

// The Cell object of the board
function Cell() {
    let value = ""; 
    const mark = (player) => {
        value = player.marker; 
    }; 
    const getValue = () => value; 
    return { mark, getValue }; 
}

// The player factory function
function createPlayer(name, marker) { 
    return { name, marker }; 
}; 

// The game controller module
const controller = (function () {
    const p1 = createPlayer("Tom", "X"); 
    const p2 = createPlayer("Jerry", "O"); 
    const board = gameBoard

    // Initialize the game board
    board.init(); 

    const players = [p1, p2]; 
    
    let activePlayer = players[0];

    const switchPlayer = () => {
        activePlayer = (
            activePlayer === players[0] ? players[1] : players[0]
        ); 
    }

    const getActivePlayer = () => activePlayer; 

    // Win-draw checker
    const checkWinDraw = (board) => {
        // Check rows
        for (row of board) {
            isSame = new Set(row.map(cell => cell.getValue())).size === 1;  
            if (isSame && row[0].getValue() !== "") {
                return 0; 
            }
        }

        // Check columns
        for (i = 0; i < board.length; i++) {
            const column = board
                           .map(row => row[i])
                           .map(cell => cell.getValue()); 
            isSame = new Set(column).size === 1; 
            if (isSame && column[0] !== "") {
                return 0; 
            }
        }

        // Check diagonals
        const diagonal1 = [board[0][0], board[1][1], board[2][2]].map(cell => cell.getValue()); 
        const diagonal2 = [board[0][2], board[1][1], board[2][0]].map(cell => cell.getValue()); 
        isSame = new Set(diagonal1).size === 1 || new Set(diagonal2).size === 1; 
        if (isSame && (diagonal1[1] !== "" || diagonal2[1] !== "")) {
            return 0; 
        }

        // Check draw
        if (gameBoard.isFull()) return 1; 
    }

    // Printing new round
    const printNewRound = () => {
        board.printBoard(); 
        console.log(`${getActivePlayer().name} (${getActivePlayer().marker}) 's turn! `)
    }

    // method: Play one round(row, column), to be exported
    const playRound = (row, column) => {
        // Get current player
        console.log(
            `Marking cell at row ${row}, column ${column} with ${getActivePlayer().marker}... `
        )
        // Mark cell with current player's marker
        const marked = board.markCell(row, column, getActivePlayer()); 
        
        if (marked === 0) {
            // TODO: Check win or draw
            const winDraw = checkWinDraw(board.getBoard()); 
            // If win-draw, print result and return 
            if (winDraw === 0) {
                board.printBoard(); 
                console.log(`${getActivePlayer().name} (${getActivePlayer().marker}) wins! `)
            } else if (winDraw === 1) {
                board.printBoard(); 
                console.log("It's a draw! ")
            } else {
                // Switch player
                switchPlayer(); 
                // Print new round: the board and who's turn it is
                printNewRound(); 
            }
        } else if (marked === 1) {
            console.log("Please try again. ")
        }
    }

    // Initialize the first round
    console.log("Starting a new game... ")
    printNewRound(); 

    return {
        playRound, 
        getActivePlayer, 
        init: board.init, 
        getBoard: board.getBoard, 
        checkWinDraw, 
    }
})(); 

// The screen controller module, for rendering UI
const screenController = (function () {
    const game = controller; 
    const messageDiv = document.querySelector(".message"); 
    const boardDiv = document.querySelector(".board"); 
    const startResetButton = document.querySelector(".start-reset"); 

    const renderStartGame = () => {
        game.init(); 
        updateScreen(); 
        messageDiv.textContent = "Please enter player names and click start. "
        messageDiv.dataset.state = "before-start"; 
        startResetButton.textContent = "Start"; 
    }

    const startGame = (p1name, p2name) => {
        messageDiv.dataset.state = "playing"; 
        updateScreen(); 
        startResetButton.textContent = "Reset"; 
    }

    const updateScreen = () => {
        // Clear board
        boardDiv.textContent = ""; 

        // Get current board state
        const board = game.getBoard(); 
        const activePlayer = game.getActivePlayer(); 

        messageDiv.textContent = `${activePlayer.name} (${activePlayer.marker}) 's turn. `; 

        // Render board
        board.forEach((row, rowIndex)=> {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button"); 
                cellButton.dataset.row = rowIndex; 
                cellButton.dataset.column = columnIndex; 
                cellButton.classList.add("cell"); 
                cellButton.textContent = cell.getValue(); 
                boardDiv.appendChild(cellButton); 
            })
        })
    }

    const renderEndGame = (endState) => {
        if (endState !== undefined) {
            messageDiv.dataset.state = "ended"; 
            if (endState === 0) {
                messageDiv.textContent = `${game.getActivePlayer().name} (${game.getActivePlayer().marker}) wins! `;
            } else if (endState === 1) {
                messageDiv.textContent = "It's a draw! ";
            }
        }
    }

    const clickHandler = (e) => {
        // Make sure a cell is clicked and the game is still in progress
        if (e.target.classList.contains("cell") !== true
            || messageDiv.dataset.state !== "playing") return; 

        // Place a mark in the UI and update the screen. 
        const row = e.target.dataset.row; 
        const column = e.target.dataset.column; 
        game.playRound(row, column); 
        updateScreen(); 

        // End the game if win or draw
        const endState = game.checkWinDraw(game.getBoard()); 
        if (endState !== undefined) renderEndGame(endState); 
    }

    const startResetHandler = () => {
        if (messageDiv.dataset.state === "before-start") {
            startGame(); 
        } else if (messageDiv.dataset.state === "playing"
                || messageDiv.dataset.state === "ended") {   
            renderStartGame(); 
        }
    }

    boardDiv.addEventListener("click", clickHandler); 
    startResetButton.addEventListener("click", startResetHandler); 
    renderStartGame(); 

    return { updateScreen }; 
})(); 

