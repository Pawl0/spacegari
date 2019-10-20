let self = null;
var SceneA = new Phaser.Class({

    Extends: Phaser.Scene,
    initialize:

    function SceneA ()
    {
        Phaser.Scene.call(this, { key: 'titleScreen' });
    },

    preload: function ()
    {
        this.load.image('title', 'assets/space_gari.jpeg');
    },

    create: function ()
    {
        background = this.physics.add.staticGroup();
        background.create(window.innerWidth/2, window.innerHeight/2, 'title').setScale(4).refreshBody();
        

        this.input.once('pointerdown', function () {

            console.log('From SceneA to SceneB');

            this.scene.start('game');

        }, this);
    }

});

var SceneB = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneB ()
    {
        Phaser.Scene.call(this, { key: 'game' });
    },

    preload: function ()
    {
        self = this;
        preload();
    },

    create: function ()
    {
        create();
    },

    update: function () 
    { 
        update();
    },

    extend: {
            text: null,
            textAltitude: null,
            textLife: null
    }

});

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
    scene: [SceneA, SceneB]
    // {
    //     preload: preload,
    //     create: create,
    //     update: update,
    //     extend: {
    //         text: null,
    //         textAltitude: null,
    //         textLife: null
    //     }
    // }
};

let {width, height} = {width: 0, height: 0};

let game = new Phaser.Game(config);

let junkMinVelocity = -500;
let junkMaxVelocity = -800;

// let arrayLife = [];
function preload ()
{
    self.load.audio('level1sound', 'assets/sounds/background/1level1.mp3');
    self.load.audio('movimento', 'assets/sounds/movimento/air.mp3');
    self.load.audio('colisao1', 'assets/sounds/colisao/colisao1.mp3');
    self.load.image('nave', 'assets/nave.png');
    self.load.image('nave2', 'assets/nave_2.png');
    self.load.image('nave3', 'assets/nave_3.png');
    self.load.image('lixo', 'assets/lixo.png');
    self.load.image('lixo_antena', 'assets/lixo_antena.png');
    self.load.image('lixo_pedaco', 'assets/lixo_pedaco.png');
    self.load.image('lixo_motor_foguete', 'assets/lixo_motor_foguete.png');
    self.load.image('star', 'assets/star2.png');
    self.load.image('vida', 'assets/vida.png');
    self.load.spritesheet('rede', 
        'assets/spritesheet.png',
        { frameWidth: 160, frameHeight: 220 }
    );
}
let junkType = ['lixo', 'lixo_pedaco', 'lixo_antena', 'lixo_motor_foguete'];
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

let sounds = {};

  function togglePause() {
    console.log('Toggling Pause');
    if (!game.scene.isActive('game')) {
        console.log("Trying to resume");
        game.scene.resume('game');
    } else {
      console.log("Trying to pause");
        game.scene.pause('game');
    }
  }

document.addEventListener('keydown', keyPause);

document.addEventListener('keydown', keyLoseLife);

function keyLoseLife(e) {
    key = e.code;
    if (key == 'KeyL') {

        if (hp > -1) {
            hp--;
        }
        console.log("HP restante: ",hp);
        console.log("life lost: ",life.getChildren());
    }
  //   console.log(key);
  }

document.addEventListener('keydown', keyIncScore);
function keyIncScore(e) {
    key = e.code;
    if (key == 'KeyS') {
        scoring(player,null);
        console.log("score: ",score);
    }
  }

let key = null;
function keyPause(e) {
  key = e.code;
  if (key == 'KeyP') {
    togglePause();
  }
}

function create ()
{
    sounds.level1 = game.sound.add('level1sound');
    sounds.movimento = game.sound.add('movimento');
    sounds.colisao1 = game.sound.add('colisao1');
    self.sound.play('level1sound', { loop: true });
     width = self.sys.game.canvas.width;
     height = self.sys.game.canvas.height;

     
    self.physics.world.setBounds(-200, 0, width+350, height, true, true, true, true);
    // ================ SCENARIO ============================================
    life = self.physics.add.staticGroup();
    life.create(20, 45, 'vida').setScale(0.025).refreshBody();

    // ================ CREATE STARFIELD ======================
    // createStarfield.bind(this)();

    ship = self.physics.add.staticGroup();

    ship.create(100, 300, 'nave').setScale(1).refreshBody();

    // ================ PLAYER ============================================

    player = self.physics.add.sprite(200, 300, 'rede');

    player.setBounce(0);
    player.setCollideWorldBounds(true);
    player.setMaxVelocity(1000);
    player.angle = 0;
    player.setScale(0.5);


    // ================ PLAYER ANIMATION ============================================
    self.anims.create({
        key: 'up',
        frames: self.anims.generateFrameNumbers('rede', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });

    self.anims.create({
        key: 'turn',
        frames: [ { key: 'rede', frame: 3 } ],
        frameRate: 20
    });

    self.anims.create({
        key: 'down',
        frames: self.anims.generateFrameNumbers('rede', { start: 4, end: 6 }),
        frameRate: 10,
        repeat: -1
    });

    // ================ COLLISION ============================================
    self.physics.add.collider(player, ship);

    // ================ CONTROLS ============================================
    cursors = self.input.keyboard.createCursorKeys();

    // ================ SCORE =========================
    self.text = self.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' }).setDepth(1).setScrollFactor(0);
    self.textAltitude = self.add.text(10, height-20, '', { font: '16px Courier', fill: '#00ff00' }).setDepth(1).setScrollFactor(0);
    self.textLife = self.add.text(20, 40, '', { font: '16px Courier', fill: '#00ff00' }).setDepth(1).setScrollFactor(0);

}


let arrayJunk = [];
let arrayJunk2 = [];
let arrayStars = [];

let spawnId = 0;

function spawn(position,minVelocity, maxVelocity, key, collision) {

    enemies = self.physics.add.group({
        key: key,
        setXY: { x: position, y: Phaser.Math.FloatBetween(30, height-20), stepY: Phaser.Math.FloatBetween(20, 70) }
    });
    
    enemies.children.iterate(function (child) {

        child.setScale(0.5);
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.velX = Phaser.Math.FloatBetween(minVelocity, maxVelocity);
        child.setVelocityX(child.velX);
        child.depth = -1;

            child.setCollideWorldBounds(true);
        
            child.body.onWorldBounds = true;
            child.body.world.on('worldbounds', function(body) {
                // Check if the body's game object is the sprite you are listening for
                if (body.gameObject === self) {
                    // Stop physics and render updates for this object
                    if (arrayJunk.indexOf(enemies) != -1) {
                        arrayJunk.splice(arrayJunk.indexOf(enemies),1);
                    };
                    if (arrayJunk2.indexOf(enemies) != -1)arrayJunk2.splice(arrayJunk2.indexOf(enemies),1);
                    self.setActive(false);
                    self.setVisible(false);
                    // this.destroy();
                    game.scene.remove(self);
                    // console.log("Destruiu");
                }
            }, child);
    });
    if (collision) {
        self.physics.add.overlap(player, enemies, scoring, null, self);
        self.physics.add.overlap(ship, enemies, damage, null, self);
        spawnId++;
        if (spawnId % 2 == 0) arrayJunk.push(enemies);
        else arrayJunk2.push(enemies);
    } else {
        arrayStars.push(enemies);
    }
}

let lastUpdateTime = 0;
let lastUpdateTimeStars = 0;
let lastUpdateTimePause = 0;
let score = 0;
let altitude = 500;
let hp = 3;
let scoreOld = score;
let scoreLife = score;
let altitudeOld = altitude;

function scoring (player, junk)
{
    score++;
    
    if (score-scoreOld == 1) {
        scoreOld = score;
        altitude += 500;
    }

    if (altitude == 5000) {    
        ship.clear(true);
        ship = self.physics.add.staticGroup();
        ship.create(100, 300, 'nave2').setScale(1).refreshBody();
        altitudeOld = altitude;
    }

    if (altitude == 10000) {    
        ship.clear(true);
        ship = self.physics.add.staticGroup();
        ship.create(150, 300, 'nave3').setScale(1).refreshBody();
        console.log("player: ",player);
        player.x = player.x+150;
        altitudeOld = altitude;
    }

    if (score-scoreLife == 5) {
        scoreLife = score;
        hp++;
    }
    if (junk) junk.disableBody(true, true);
}


function damage (ship, junk) {
    hp--;
    self.sound.play('colisao1', { loop: false });
    junk.disableBody(true, true);
    if (hp < 0) ship.disableBody(true, true);
}

function update() {
    self.text.setText("SCORE: " + score);
    self.textAltitude.setText("ALTITUDE: " + altitude + "KM");
    self.textLife.setText(" x"+hp);
    // ================ CONTROLS ============================================
    if (cursors.down.isDown)
    {
        player.setAccelerationY(300);

        player.anims.play('down', true);

        if (!sounds.movimento.isPlaying)
            sounds.movimento.play();
    }
    else if (cursors.up.isDown)
    {
        player.setAccelerationY(-300);

        player.anims.play('up', true);

        if (!sounds.movimento.isPlaying)
        sounds.movimento.play();
    }
    else
    {
        sounds.movimento.stop();
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

    if (lastUpdateTime < Date.now() - 2000) {
        let junkindex = Phaser.Math.FloatBetween(0, 3);
        spawn.bind(this, width+100, junkMinVelocity, junkMaxVelocity, junkType[junkindex.toFixed(0)], 'lixo', true)();
        lastUpdateTime = Date.now();
    }

    if (lastUpdateTimeStars < Date.now() - 1000) {
        spawn.bind(this, width+100, -10, -500, 'star', false)();
        lastUpdateTimeStars = Date.now();
    }
}