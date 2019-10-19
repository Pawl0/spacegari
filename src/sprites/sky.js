function Sky(game) {
    this.game = game;

    this.game.load.image('sky', 'assets/sky.png');
}

Sky.prototype.draw = function() {
    this.game.physics.add.image(400, 300, 'sky');
}