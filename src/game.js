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
    this.sky = new Sky(this);

    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('nave', 'assets/nave.png');
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create ()
{

    // ================ SCENARIO ============================================
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    ship = this.physics.add.staticGroup();

    ship.create(100, 300, 'nave').setScale(1).refreshBody();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();


    //================= UPPER PLATFORMS ==================
    // platforms.create(600, 400, 'ground');
    // platforms.create(50, 250, 'ground');
    // platforms.create(750, 220, 'ground');

    // ================ PLAYER ============================================

    player = this.physics.add.sprite(250, 450, 'dude');

    player.setBounce(0);
    player.setCollideWorldBounds(true);
    player.setMaxVelocity(1000);


    // ================ PLAYER ANIMATION ============================================
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // ================ COLLECTABLES ============================================
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    
    stars.children.iterate(function (child) {
    
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    
    });


    // ================ COLLISION ============================================
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, ship);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    // ================ CONTROLS ============================================
    cursors = this.input.keyboard.createCursorKeys();


    function collectStar (player, star)
    {
        star.disableBody(true, true);
    }
}

function update() {

    // ================ CONTROLS ============================================
    if (cursors.down.isDown)
    {
        player.setAccelerationY(160);

        player.anims.play('left', true);
    }
    else if (cursors.up.isDown)
    {
        player.setAccelerationY(-160);

        player.anims.play('right', true);
    }
    else
    {
        player.setAccelerationY(0);

        player.anims.play('turn');
    }


    // =============JUMP =============
    // if (cursors.up.isDown && player.body.touching.down)
    // {
    //     player.setVelocityY(-330);
    // }
}