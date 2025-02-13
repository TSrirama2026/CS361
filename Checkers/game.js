let board = document.getElementByID("board");

for (let i = 1; i <= 8; i++){
    const CellContainer = document.createElement("div");
    cellContainer.className = "cellContainer";
    for (let j = 0; j <= 8; j++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        if (i % 2 === 0) {
            if (j % 2 === 0) {
                cell.style.backgroundColor = "black";
            } else {
                cell.style.backgroundColor = "white";
            }
        } else {
            if (j % 2 === 0){
                cell.style.backgroundColor = "white";
            } else { 
                cell.style.backgroundColor = "black";
            }
        }
        cellContainer.append(cell);
    }
    board.append(cellContainer);
}