function Logo(game) {
    this.game = game;

    this.game.load.image('logo', 'assets/img.png');
}

Logo.prototype.draw = function() {
    this.game.physics.add.image(400, 300, 'logo');
}