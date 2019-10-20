let config = {
    type: Phaser.AUTO,
    width: window.innerWidth * window.devicePixelRatio, 
    height: window.innerHeight * window.devicePixelRatio,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
            text: null
        }
    }
};

let {width, height} = {width: 0, height: 0};

let game = new Phaser.Game(config);

function preload ()
{

    this.load.image('nave', 'assets/nave.png');
    this.load.image('lixo', 'assets/lixo.png');
    this.load.image('star', 'assets/star2.png');
    this.load.spritesheet('rede', 
        'assets/spritesheet.png',
        { frameWidth: 160, frameHeight: 220 }
    );
}

let angle = 0;
function createStarfield ()
{

    var group = this.add.group({ key: 'star', frameQuantity: 256 });

    var rect = new Phaser.Geom.Rectangle(0, 0, 3200, height);


    Phaser.Actions.RandomRectangle(group.getChildren(), rect);

    group.children.iterate(function (child, index) {

        var sf = Math.max(0.3, Math.random());

        if (child.texture.key === 'bigStar')
        {
            sf = 0.2;
        }

        child.setScrollFactor(sf);

    }, this);
}

function create ()
{


     width = this.sys.game.canvas.width;
     height = this.sys.game.canvas.height;
    // ================ SCENARIO ============================================
    

    // ================ CREATE STARFIELD ======================
    // createStarfield.bind(this)();

    ship = this.physics.add.staticGroup();

    ship.create(100, 300, 'nave').setScale(1).refreshBody();

    // ================ PLAYER ============================================

    player = this.physics.add.sprite(200, 300, 'rede');

    player.setBounce(0);
    player.setCollideWorldBounds(true);
    player.setMaxVelocity(1000);
    player.angle = 0;
    player.setScale(0.5);


    // ================ PLAYER ANIMATION ============================================
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('rede', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'rede', frame: 3 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('rede', { start: 4, end: 6 }),
        frameRate: 10,
        repeat: -1
    });

    // ================ COLLISION ============================================
    this.physics.add.collider(player, ship);

    // ================ CONTROLS ============================================
    cursors = this.input.keyboard.createCursorKeys();

    // ================ SCORE =========================
    this.text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' }).setDepth(1).setScrollFactor(0);

}


let arrayJunk = [];
let arrayJunk2 = [];

let spawnId = 0;

function spawn(position,minVelocity, maxVelocity, key, collision) {
    enemies = this.physics.add.group({
        key: key,
        setXY: { x: position, y: Phaser.Math.FloatBetween(30, height-20), stepY: Phaser.Math.FloatBetween(20, 70) }
    });
    
    enemies.children.iterate(function (child) {
    
        child.setScale(0.5);
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setVelocityX(Phaser.Math.FloatBetween(minVelocity, maxVelocity));
        child.depth = -1;
    
    });
    if (collision) {
        this.physics.add.overlap(player, enemies, scoring, null, this);
        this.physics.add.overlap(ship, enemies, damage, null, this);
    }

    spawnId++;
    if (spawnId % 2 == 0) arrayJunk.push(enemies);
    else arrayJunk2.push(enemies);
}

let lastUpdateTime = 0;
let lastUpdateTimeStars = 0;
let score = 0;
let hp = 3;

function scoring (player, junk)
{
    score++;
    junk.disableBody(true, true);
}


function damage (ship, junk) {
    hp--;
    console.log("HP: "+hp);
    ship.disableBody(true, true);
    junk.disableBody(true, true);
}

function update() {

    this.text.setText("SCORE: " + score);
    // ================ CONTROLS ============================================
    if (cursors.down.isDown)
    {
        player.setAccelerationY(100);

        player.anims.play('down', true);
    }
    else if (cursors.up.isDown)
    {
        player.setAccelerationY(-100);

        player.anims.play('up', true);
    }
    else
    {
        player.setAccelerationY(0);
        player.setVelocityY(player.body.velocity.y + (player.body.velocity.y > 0 ? -1 : 1));

        player.anims.play('turn');
    }

    // ================ JUNK ==========================

    arrayJunk.forEach(enemy => {
        enemy.children.iterate(child => {
            child.angle++;
        });
    });

    arrayJunk2.forEach(enemy => {
        enemy.children.iterate(child => {
            child.angle--;
        });
    });

    if (lastUpdateTime < Date.now() - 4000) {
        spawn.bind(this, width+100, -10, -1000, 'lixo', true)();
        lastUpdateTime = Date.now();
    }

    if (lastUpdateTimeStars < Date.now() - 50) {
        spawn.bind(this, width+100, -100, -200, 'star', false)();
        lastUpdateTimeStars = Date.now();
    }
}