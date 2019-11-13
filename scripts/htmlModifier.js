function HtmlModifier() {
    this.tileContainer = document.querySelector(".tile-container");
    this.scoreContainer = document.querySelector(".score-container");
}

HtmlModifier.prototype.modify = function (grid) {
    this.clearContainer(this.tileContainer);

    for (let y = 0; y < grid.size; y++) {
        for (let x = 0; x < grid.size; x++) {
            let tile = grid.cells[y][x];
            if (tile) this.addTile(tile);
        }
    }
}

HtmlModifier.prototype.clearContainer = function (container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

HtmlModifier.prototype.addTile = function (tile) {
    let tileDiv = document.createElement("div");
    let innerDiv = document.createElement("div");
    let position = { x: tile.x, y: tile.y};
    let positionLabel = this.positionLabel(position);
    let tileClasses = ["tile", "tile-" + tile.value.toString(), positionLabel];
    let innerClasses = ["tile-inner"];

    if (tile.merged) {
        tileClasses.push("tile-merged");
    } else if (tile.previousPosition) {
        // do nothing
    } else {
        tileClasses.push("tile-new");
    }

    this.applyClasses(tileDiv, tileClasses);
    this.applyClasses(innerDiv, innerClasses);
    innerDiv.textContent = tile.value;

    tileDiv.appendChild(innerDiv);
    this.tileContainer.appendChild(tileDiv);
}

HtmlModifier.prototype.applyClasses = function (element, classes) {
    element.setAttribute("class", classes.join(" "));
}

HtmlModifier.prototype.positionLabel = function (position) {
    return "tile-position-" + position.y.toString() + "-" + position.x.toString();
}

HtmlModifier.prototype.updateScore = function (value) {
    this.scoreContainer.textContent = value;
}
