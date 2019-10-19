let config = {
    type: Phaser.AUTO,
    width: window.innerWidth * window.devicePixelRatio, 
    height: window.innerHeight * window.devicePixelRatio,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create
    }
};

let game = new Phaser.Game(config);

function preload ()
{
    this.logo = new Logo(this);
}

function create ()
{
    this.logo.draw();
}