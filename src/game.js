let self = null;
let score = 0;
updateTopTen();
var SceneA = new Phaser.Class({

    Extends: Phaser.Scene,
    initialize:

    function SceneA ()
    {
        Phaser.Scene.call(this, { key: 'titleScreen' });
    },

    preload: function ()
    {
        this.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
        this.load.image('bg', 'assets/bg-intro.png');
        this.load.image('terra4', 'assets/terra-camada4.png');
        this.load.image('terra3', 'assets/terra-camada3.png');
        this.load.image('terra2', 'assets/terra-camada2.png');
        this.load.image('terra1', 'assets/terra-camada1.png');
        this.load.image('terra', 'assets/terrinha.png');
        this.load.image('name', 'assets/SPACEGARI-TITLE.png');
        this.load.image('gari','assets/astrogari.png');
        this.load.image('button', 'assets/playbutton.png');
    },

    create: function ()
    {
        this.cameras.main.setBackgroundColor('rgb(0,0,85)');
        face = this.add.image(window.innerWidth/2,window.innerHeight/2, 'bg');
        terra4 = this.add.image(window.innerWidth/2,window.innerHeight/2, 'terra4');;
        terra3 = this.add.image(window.innerWidth/2,window.innerHeight/2, 'terra3');;
        terra2 = this.add.image(window.innerWidth/2,window.innerHeight/2, 'terra2');;
        terra1 = this.add.image(window.innerWidth/2,window.innerHeight/2, 'terra1');;
        terra = this.add.image(window.innerWidth/2,window.innerHeight/2, 'terra');
        name = this.add.image(window.innerWidth/2, window.innerHeight/4, 'name');
        gari = this.add.image(window.innerWidth/4, window.innerHeight/1.5, 'gari');
        button = this.add.image(window.innerWidth/1.5, window.innerHeight/1.5, 'button');
        

        this.input.once('pointerdown', function () {

            console.log('From SceneA to SceneB');

            this.scene.start('game');

        }, this);
    },
    // extend: {
    //     face = null,
    //     terra = null,
    //     name = null,
    //     gari = null,
    //     button = null,
    //     terra1 = null,
    //     terra2 = null,
    //     terra3 = null,
    //     terra4 = null
    // }

});

let nave = 1;

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


class SceneC extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'GameOver' });

        this.score = 0;
    }

    create ()
    {
        let {width, height} = self.sys.game.canvas;
        let rect = new Phaser.Geom.Rectangle(0, 0, width, height);

        let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff55 } });
        graphics.setDefaultStyles({
            fillStyle: {
                color: 0x000000,
                alpha: 0.5
            }
        });
        graphics.fillRectShape(rect);
        let offY = -100;
        this.add.bitmapText(width/2, height/2-100+offY, 'carrier_command','Game Over!', 44).setOrigin(0.5);
        this.add.bitmapText(width/2, height/2+offY, 'carrier_command','Your score: ' + score, 24).setOrigin(0.5);
        this.add.bitmapText(width/2, height/2+50+offY, 'carrier_command','tap to restart', 14).setOrigin(0.5);
        this.add.bitmapText(width/2, height/2+150+offY, 'carrier_command','TOP PLAYERS', 15).setOrigin(0.5);
        var person = prompt("Please enter your name", sessionStorage.getItem('name') || '');
        
        if (person != null) {
            let sc = new Score(person, score);
            sc.upload();
            let me;
            if ((me = topTenScores.find(p => p.name.toLowerCase() == person.toLowerCase()))) {
                me.score = score;
            } else {
                topTenScores.push(sc);
            }
            
        }
        sortTopTen();
        let i = 1;
        for (let person of topTenScores) {
            this.add.bitmapText(width/2, height/2+160+offY+i*25, 'carrier_command',`${i++} ${person.name}: ${person.score}`, 10).setOrigin(0.5);
        }
    }
}

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
    scene: [SceneA, SceneB, SceneC]
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
    self.load.image('lixo2', 'assets/lixo02.png');
    self.load.image('lixo_antena', 'assets/lixo_antena.png');
    self.load.image('lixo_pedaco', 'assets/lixo_pedaco.png');
    self.load.image('lixo_motor_foguete', 'assets/lixo_motor_foguete.png');
    self.load.image('star', 'assets/star2.png');
    self.load.image('vida', 'assets/vida.png');
    self.load.spritesheet('rede1', 
        'assets/spritesheet.png',
        { frameWidth: 160, frameHeight: 220 }
    );
    self.load.spritesheet('rede2', 
        'assets/rede02.png',
        { frameWidth: 160, frameHeight: 220 }
    );
}
let junkType = ['lixo', 'lixo_pedaco', 'lixo_antena', 'lixo_motor_foguete', 'lixo2'];
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

        if (hp > 0) {
            hp--;

        game.scene.run('GameOver')
        togglePause();
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

    // ================ SCENARIO ============================================
    self.physics.world.setBounds(-200, 0, width+350, height, true, true, true, true);

    // ================ LIVES ==============================================
    life = self.physics.add.staticGroup();
    life.create(20, 45, 'vida').setScale(0.025).refreshBody();

    // ================ CREATE STARFIELD ======================
    // createStarfield.bind(this)();

    ship = self.physics.add.sprite(100, 300, 'nave');

    ship.setScale(1);
    ship.dir = 1;
    // ================ PLAYER ============================================


    // ================ PLAYER ANIMATION ============================================
    self.anims.create({
        key: 'up1',
        frames: self.anims.generateFrameNumbers('rede1', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });

    self.anims.create({
        key: 'up2',
        frames: self.anims.generateFrameNumbers('rede2', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });

    self.anims.create({
        key: 'turn1',
        frames: [ { key: 'rede1', frame: 3 } ],
        frameRate: 20
    });

    self.anims.create({
        key: 'turn2',
        frames: [ { key: 'rede2', frame: 3 } ],
        frameRate: 20
    });

    self.anims.create({
        key: 'down1',
        frames: self.anims.generateFrameNumbers('rede1', { start: 4, end: 6 }),
        frameRate: 10,
        repeat: -1
    });

    self.anims.create({
        key: 'down2',
        frames: self.anims.generateFrameNumbers('rede2', { start: 4, end: 6 }),
        frameRate: 10,
        repeat: -1
    });

    player = self.physics.add.sprite(230, 300, 'rede2');

    player.setBounce(0);
    player.setCollideWorldBounds(true);
    player.setMaxVelocity(1000);
    player.angle = 0;
    player.setScale(0.5);

    // ================ COLLISION ============================================
    // self.physics.add.collider(player, ship);

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
        ship.setTexture('nave2');
        altitudeOld = altitude;
    }

    if (altitude == 10000) {  
        ship.setTexture('nave3');
        altitudeOld = altitude;
    }

    if (score-scoreLife == 5) {
        scoreLife = score;
        hp++;
    }

    if (score == 1) {
        nave = 2;
        player.setScale(1);
    }

    if (junk) junk.disableBody(true, true);
}


function damage (ship, junk) {
    hp--;
    self.sound.play('colisao1', { loop: false });
    junk.disableBody(true, true);
    if (hp <= 0) {
        ship.disableBody(true, true);
        game.scene.run('GameOver');
        togglePause();
    }
}



function update() {
    self.text.setText("SCORE: " + score);
    self.textAltitude.setText("ALTITUDE: " + altitude + "KM");
    self.textLife.setText(" x"+hp);
    // ================ CONTROLS ============================================
    if (cursors.down.isDown)
    {
        player.setAccelerationY(300);

        player.anims.play('down'+nave, true);

        if (!sounds.movimento.isPlaying)
            sounds.movimento.play();
    }
    else if (cursors.up.isDown)
    {
        player.setAccelerationY(-300);

        player.anims.play('up'+nave, true);

        if (!sounds.movimento.isPlaying)
        sounds.movimento.play();
    }
    else
    {
        sounds.movimento.stop();
        player.setAccelerationY(0);
        player.setVelocityY(player.body.velocity.y + (player.body.velocity.y > 0 ? -1 : 1));

        player.anims.play('turn'+nave);
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
        let junkindex = Phaser.Math.FloatBetween(0, 4);
        spawn.bind(this, width+100, junkMinVelocity, junkMaxVelocity, junkType[junkindex.toFixed(0)], 'lixo', true)();
        lastUpdateTime = Date.now();
    }

    if (lastUpdateTimeStars < Date.now() - 1000) {
        spawn.bind(this, width+100, -10, -500, 'star', false)();
        lastUpdateTimeStars = Date.now();
    }
    
    ship.setVelocityY(ship.dir == 1 ? 50 : -50);

    if (ship.y > height - ship.height / 2 && ship.dir == 1 || ship.y < ship.height / 2 && ship.dir == -1){
        ship.dir = ship.dir == 1 ? -1 : 1;
    }
}