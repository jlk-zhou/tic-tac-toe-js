// The Game Board Module
const gameBoard = (function () {
    const rows = 3; 
    const columns = 3; 
    const board = []; 

    // The Cell object of the board
    function Cell() {
        let value = ""; 
        const mark = (player) => {
            value = player.marker; 
        }; 
        const getValue = () => value; 
        return { mark, getValue }; 
    }

    // Check whether the board is full
    function _isFull(board) {
        const emptyCellsCount = board
            .flat()
            .filter(cell => cell.getValue() === "")
            .length;
        return emptyCellsCount === 0 ? true : false;  
    }

    // Initializes or resets the game board
    const init = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = []; 
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell()); 
            }
        }
    }; 

    // Get current state of the board
    const getBoard = () => board; 

    // Mark a cell with a player's marker
    const markCell = (row, column, player) => {
        if (_isFull(board)) {
            console.log("Board is full! "); 
            return; 
        }; 
        
        const cell = board[row][column]; 
        if (cell.getValue() === "") {
            cell.mark(player); 
        } else {
            console.log("Cell already marked! "); 
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
        getBoard, 
        markCell, 
        printBoard, 
    }; 

})(); 

const createPlayer = (name, marker) => { 
    return { name, marker }; 
}; 

const controller = (function () {
    const p1 = createPlayer("Tom", "X"); 
    const p2 = createPlayer("Jerry", "O"); 
    const board = gameBoard
    
    board.init(); 
    board.printBoard(); 

    // Active player setter

    // Active player switcher

    // Win-draw checker

    // Printing new round

    // method: Play one round(row, column), to be exported
        // Get current player
        // Mark cell with current player's marker
        // Check win or draw
            // If win-draw, print result and return 
        // Switch player
        // Print new round: the board and who's turn it is
    
})(); 

