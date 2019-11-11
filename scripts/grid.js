function Grid(size) {
    this.size = size;
    this.cells = this.emptyGrid();
}

Grid.prototype.emptyGrid = function() {
    let cells = [];

    for (let y = 0; y < this.size; y++) {
        let row = [];
        cells[y] = row;

        for (let x = 0; x < this.size; x++) {
            row.push(null);
        }
    }

    return cells;
}

Grid.prototype.randomAvailablePositions = function() {
    let positions = this.availablePositions();

    if (positions.length) {
        return positions[Math.floor(Math.random() * positions.length)];
    } else {
        return null;
    }
}

Grid.prototype.availablePositions = function() {
    let positions = [];

    for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
            if (!this.cells[y][x]) {
                positions.push({
                    x: x,
                    y: y
                });
            }
        }
    }

    return positions;
}

// forces return of true or false
Grid.prototype.isCellAvailable = function() {
    return !!this.availablePositions().length;
}

// insert tile into cell
Grid.prototype.insertTile = function(tile) {
    this.cells[tile.y][tile.x] = tile;
}

Grid.prototype.isCellEmpty = function(location) {
    return !this.cells[location.y][location.x]
}