let xTurn
const X = "x";
const O = "o";
const WINNING_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

const cells = document.querySelectorAll("[data-cell]")
const board = document.querySelector("#board")
const restartButton = document.querySelector("#restart")
const message = document.querySelector(".message")
const messageText = document.querySelector("[data-message-text]")


startGame()


function startGame(){
    xTurn = true;
    cells.forEach(cell=>{
        cell.addEventListener("click",handleClick, {once:true})
    })
    restartButton.addEventListener("click",restartGame)
    setBoardHoverClass()
}

function restartGame(){
    message.classList.remove("show")
    cells.forEach(cell=>{
        cell.classList.remove(X)
        cell.classList.remove(O)
        restartButton.removeEventListener("click",handleClick)
    })
    startGame()
}

function handleClick(e){
    const cell = e.target;
    const currentClass = xTurn ? X : O
    placeMark(cell, currentClass)
    
    if(checkWin(currentClass)){
        endGame(false) 
    }else if(isDraw()){ 
        endGame(true) 
    }else{
        swapTurn()
        setBoardHoverClass()
    }
}

function placeMark(cell,currentClass){
    cell.classList.add(currentClass);
}

function swapTurn(){
    xTurn = !xTurn
}

function setBoardHoverClass(){
board.classList.remove(X)
board.classList.remove(O)
xTurn ? board.classList.add(X) : board.classList.add(O)
}


function checkWin(currentClass){
   return WINNING_COMBINATIONS.some(combination=>{
        return combination.every(index=>{
           return cells[index].classList.contains(currentClass)
        });
    });
};

function isDraw(){
    //cells does not have a .every method so we will convert it to an array first using destructuring 
    return [...cells].every(cell => {
        return cell.classList.contains(X) || cell.classList.contains(O)
    })
}

function endGame(draw){
    if(draw) {
        messageText.innerHTML = `It's a Draw!`
        message.classList.add("show")
    } else {
        messageText.innerHTML = `${xTurn? "X": "O"} is the Winner!`
        message.classList.add("show")
    }
}