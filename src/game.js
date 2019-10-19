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
        update: update
    }
};


let game = new Phaser.Game(config);

function preload ()
{

    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('nave', 'assets/nave.png');
    this.load.image('lixo', 'assets/lixo.png');
    this.load.image('rede', 'assets/rede.png');
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

let angle = 0;

function create ()
{


    let {width, height} = this.sys.game.canvas;

    // ================ SCENARIO ============================================
    
    platforms = this.physics.add.staticGroup();

    ship = this.physics.add.staticGroup();

    ship.create(100, 300, 'nave').setScale(1).refreshBody();

    // ================ PLAYER ============================================

    player = this.physics.add.sprite(200, 300, 'rede');

    player.setBounce(0);
    player.setCollideWorldBounds(true);
    player.setMaxVelocity(1000);
    player.angle = 90;
    player.setScale(0.5);


    // ================ PLAYER ANIMATION ============================================
    // this.anims.create({
    //     key: 'left',
    //     frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    //     frameRate: 10,
    //     repeat: -1
    // });

    // this.anims.create({
    //     key: 'turn',
    //     frames: [ { key: 'dude', frame: 4 } ],
    //     frameRate: 20
    // });

    // this.anims.create({
    //     key: 'right',
    //     frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    //     frameRate: 10,
    //     repeat: -1
    // });

    // ================ COLLECTABLES ============================================
    // stars = this.physics.add.group({
    //     key: 'lixo',
    //     repeat: 0,
    //     setXY: { x: width, y: 0, stepY: 70 }
    // });
    
    // stars.children.iterate(function (child) {
    
    //     child.angle = angle + 90;
    //     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    //     child.setVelocityX(Phaser.Math.FloatBetween(-10, -50));
    
    // });


    // ================ COLLISION ============================================
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, ship);
    // this.physics.add.collider(stars, platforms);
    // this.physics.add.overlap(player, stars, collectStar, null, this);

    // ================ CONTROLS ============================================
    cursors = this.input.keyboard.createCursorKeys();


    
}

function collectStar (player, star)
{
    star.disableBody(true, true);
}

let arrayJunk = [];

function spawn(position,minVelocity, maxVelocity) {
    enemies = this.physics.add.group({
        key: 'lixo',
        // repeat: 1,
        setXY: { x: position, y: Phaser.Math.FloatBetween(0, 600), stepY: Phaser.Math.FloatBetween(20, 70) }
    });
    
    enemies.children.iterate(function (child) {
    
        child.setScale(0.5);
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setVelocityX(Phaser.Math.FloatBetween(minVelocity, maxVelocity));
    
    });
    this.physics.add.overlap(player, enemies, collectStar, null, this);
    arrayJunk.push(enemies);
}

let lastUpdateTime = 0;

function update() {

    // ================ CONTROLS ============================================
    if (cursors.down.isDown)
    {
        player.setAccelerationY(100);

        // player.anims.play('left', true);
    }
    else if (cursors.up.isDown)
    {
        player.setAccelerationY(-100);

        // player.anims.play('right', true);
    }
    else
    {
        player.setAccelerationY(0);
        player.setVelocityY(player.body.velocity.y + (player.body.velocity.y > 0 ? -1 : 1));

        // player.anims.play('turn');
    }

    arrayJunk.forEach(enemy => {
        enemy.children.iterate(child => {
            child.angle++;
        });
    });

    if (lastUpdateTime < Date.now() - 3000) {
        spawn.bind(this, 900, -10, -30)();
        lastUpdateTime = Date.now();
    }
}