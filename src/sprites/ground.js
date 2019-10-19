function Ground(game) {
    this.game = game;

    this.game.load.image('ground', 'assets/ground.png');
}

Ground.prototype.draw = function() {
    this.game.physics.add.image(400, 300, 'ground');
}