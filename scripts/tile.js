function Tile(position, value) {
    this.x = position.x;
    this.y = position.y;
    this.value = value;
    this.merged = false;
    this.previousPosition = null;
}

Tile.prototype.savePosition = function (position) {
    this.previousPosition = { x: position.x, y: position.y};
}

Tile.prototype.updatePosition = function (position) {
    this.x = position.x;
    this.y = position.y;
};

Tile.prototype.serialize = function () {
    return {
        position: {
        x: this.x,
        y: this.y
        },
        value: this.value
    };
};