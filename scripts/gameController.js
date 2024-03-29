function GameController(HtmlModifier, InputController) {
    this.grid = new Grid(4);
    this.numStartTiles = 2;
    this.winningTile = 2048;
    this.gameScore = 0;

    this.htmlModifier = new HtmlModifier();
    this.inputController = new InputController(this);

    this.setup();
}

GameController.prototype.newGame = function () {
    this.grid.cells = this.grid.emptyGrid();
    this.resetScore();
    this.htmlModifier.resetGameMessage();
    this.htmlModifier.updateScore(this.gameScore);
    this.setup();
}

GameController.prototype.resetScore = function () {
    this.gameScore = 0;
}

GameController.prototype.setup = function () {
    this.addStartTiles();
    this.htmlModifier.modify(this.grid);
}

GameController.prototype.addStartTiles = function () {
    for (let i = 0; i < this.numStartTiles; i++) {
        this.addRandomTile();
    }
}

GameController.prototype.addRandomTile = function () {
    if (this.grid.isCellAvailable) {
        let tile = new Tile(this.grid.randomAvailablePositions(), this.randomTileValue());
        this.grid.insertTile(tile);
    }
}

GameController.prototype.randomTileValue = function () {
    return Math.floor(Math.random() * 2 + 1) * 2;
}

GameController.prototype.moveUp = function () {
    let tilesMoved = false;
    for (let y = 1; y < this.grid.size; y++) {
        for (let x = 0; x < this.grid.size; x++) {
            let tile = this.grid.cells[y][x];
            let targetLocation = {x: x, y: y};

            while (tile) {
                targetLocation.y--;
                if (targetLocation.y < 0) break;

                // keep moving until blocked
                if (this.grid.isCellEmpty(targetLocation)) {
                    this.moveTile(tile, targetLocation);
                    tilesMoved = true;
                } else { // try to merge
                    if (this.mergedTile(tile, targetLocation)) {
                        tilesMoved = true;
                    }
                    break;
                }
            }
        }
    }

    this.checkGrid(tilesMoved);
}

GameController.prototype.moveLeft = function () {
    let tilesMoved = false;
    for (let y = 0; y < this.grid.size; y++) {
        for (let x = 1; x < this.grid.size; x++) {
            let tile = this.grid.cells[y][x];
            let targetLocation = {x: x, y: y};

            while (tile) {
                targetLocation.x--;
                if (targetLocation.x < 0) break;

                // keep moving until blocked
                if (this.grid.isCellEmpty(targetLocation)) {
                    this.moveTile(tile, targetLocation);
                    tilesMoved = true;
                } else { // try to merge
                    if (this.mergedTile(tile, targetLocation)) {
                        tilesMoved = true;
                    }
                    break;
                }
            }
        }
    }

    this.checkGrid(tilesMoved);
}

GameController.prototype.moveRight = function () {
    let tilesMoved = false;
    for (let y = 0; y < this.grid.size; y++) {
        for (let x = this.grid.size - 2; x >= 0; x--) {
            let tile = this.grid.cells[y][x];
            let targetLocation = {x: x, y: y};

            while (tile) {
                targetLocation.x++;
                if (targetLocation.x == this.grid.size) break;

                // keep moving until blocked
                if (this.grid.isCellEmpty(targetLocation)) {
                    this.moveTile(tile, targetLocation);
                    tilesMoved = true;
                } else { // try to merge
                    if (this.mergedTile(tile, targetLocation)) {
                        tilesMoved = true;
                    }
                    break;
                }
            }
        }
    }

    this.checkGrid(tilesMoved);
}

GameController.prototype.moveDown = function () {
    let tilesMoved = false;
    for (let y = this.grid.size - 2; y >= 0; y--) {
        for (let x = 0; x < this.grid.size; x++) {
            let tile = this.grid.cells[y][x];
            let targetLocation = {x: x, y: y};

            while (tile) {
                targetLocation.y++;
                if (targetLocation.y == this.grid.size) break;

                // keep moving until blocked
                if (this.grid.isCellEmpty(targetLocation)) {
                    this.moveTile(tile, targetLocation);
                    tilesMoved = true;
                } else { // try to merge
                    if (this.mergedTile(tile, targetLocation)) {
                        tilesMoved = true;
                    }
                    break;
                }
            }
        }
    }

    this.checkGrid(tilesMoved);
}

GameController.prototype.moveTile = function (tile, location) {
    this.grid.cells[location.y][location.x] = tile;
    this.grid.cells[tile.y][tile.x] = null;
    tile.savePosition(tile.serialize().position);
    tile.updatePosition(location);
}

// return true if tiles merge else false
GameController.prototype.mergedTile = function (tile, location) {
    let targetTile = this.grid.cells[location.y][location.x];
    if (tile.value == targetTile.value && !targetTile.merged) {
        targetTile.value *= 2;
        targetTile.merged = true;
        this.grid.cells[tile.y][tile.x] = null;
        this.updateScore(targetTile.value);
        this.htmlModifier.updateScore(this.gameScore);
        return true;
    }
    tile.savePosition(tile.serialize().position);
    return false;
}

GameController.prototype.unsetMergeStatus = function () {
    for (let y = 0; y < this.grid.size; y++) {
        for (let x = 0; x < this.grid.size; x++) {
            let tile = this.grid.cells[y][x];
            if (tile) {
                tile.merged = false;
            }
        }
    }
}

GameController.prototype.checkGrid = function (tilesMoved) {
    if (tilesMoved) {
        this.edgeCheckPreviousPosition();
        this.addRandomTile();
        this.htmlModifier.modify(this.grid);
        this.checkGameFinished();
        this.unsetMergeStatus();
    }
}

// make sure edge tiles's previous position are updated
GameController.prototype.edgeCheckPreviousPosition = function () {
    for (let y = 0; y < this.grid.size; y++) {
        for (let x = 0; x < this.grid.size; x++) {
            if (y === 0 || x === 0 || y === this.grid.size -1 || x === this.grid.size -1) {
                let tile = this.grid.cells[y][x];
                if (tile && !tile.previousPosition) {
                    tile.savePosition(tile.serialize().position);
                }
            }
        }
    }
}

GameController.prototype.checkGameFinished = function () {
    let tileCount = 0;
    for (let y = 0; y < this.grid.size; y++) {
        for (let x = 0; x < this.grid.size; x++) {
            let tile = this.grid.cells[y][x];
            if (tile) {
                tileCount++;
                if (this.isWinningTile(tile)) {
                    this.htmlModifier.gameWon();
                }
                if (this.isMatchingNeighbour(tile)) {
                    return;
                }
            }
        }
    }

    if (tileCount === (this.grid.size ** 2)) {
        this.htmlModifier.gameOver();
    }
}

GameController.prototype.isWinningTile = function (tile) {
    if (tile.value === this.winningTile ) return true;
    return false;
}

GameController.prototype.isMatchingNeighbour = function (tile) {
    // left
    if (tile.x - 1 >= 0) {
        if (this.grid.cells[tile.y][tile.x - 1]) {
            if (this.grid.cells[tile.y][tile.x - 1].value === tile.value) {
                return true;
            }
        }
    }
    // right
    if (tile.x + 1 < this.grid.size) {
        if (this.grid.cells[tile.y][tile.x + 1]) {
            if (this.grid.cells[tile.y][tile.x + 1].value === tile.value) {
                return true;
            }
        }
    }
    // up
    if (tile.y - 1 >= 0) {
        if (this.grid.cells[tile.y - 1][tile.x]) {
            if (this.grid.cells[tile.y - 1][tile.x].value === tile.value) {
                return true;
            }
        }
    }
    // down
    if (tile.y + 1 < this.grid.size) {
        if (this.grid.cells[tile.y + 1][tile.x]) {
            if (this.grid.cells[tile.y + 1][tile.x].value === tile.value) {
                return true;
            }
        }
    }

    return false;
}

GameController.prototype.updateScore = function (value) {
    this.gameScore += value;
} 

GameController.prototype.print = function () {
    output = "";
    for (let y = 0; y < this.grid.size; y++) {
        for (let x = 0; x < this.grid.size; x++) {
            let tile = this.grid.cells[y][x];
            if (tile) {
                output += tile.value.toString();
            }
            else {
                output += "0";
            }
            output += ","
        }
        output += "\n"
    }
    return output;
}