function InputController(GameController) {
    this.gameController = GameController;

    this.setup();
    this.listen();
}

InputController.prototype.setup = function () {
    this.newGameOnClick();
}

InputController.prototype.newGameOnClick = function () {
    let self = this;
    let newGameButton = document.querySelector(".new-game");
    newGameButton.onclick = function () { self.gameController.newGame(); };
}

InputController.prototype.listen = function () {
    let self = this;
    document.addEventListener('keydown', function(event) {
        if (event.keyCode == 37) {
            self.gameController.moveLeft();
        }
        else if (event.keyCode == 38) {
            self.gameController.moveUp();
        }
        else if (event.keyCode == 39) {
            self.gameController.moveRight();
        }
        else if (event.keyCode == 40) {
            self.gameController.moveDown();
        }
    }, true);
}