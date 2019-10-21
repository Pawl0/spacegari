let self = null;
let score = 0;
updateTopTen();


let textsToShow = [
    [
        "Congratulations for being chosen to be a Space Cleaner!",
        "Your mission is to protect NASA's SkyLab from all the dangerous",
        "space junk that's floating around due to some people not being very careful...",
        "",
        "You can use the Up and Down Arrow Keys to move the Protective Net arround."
    ],
    [
        "You have successfully protected SkyLab!",
        "Now, you have been assigned to protect the International Space Station!",
        "The space junk can mess up all the cool experiments they are doing in there!"
    ],
    [
        "What a great work protecting ISS!",
        "Now, you have a very special mission!",
        "You will be the Interplanetary Gateway's guardian.",
        "The humanity's future can be changed by that spaceship."
    ]
];

let textTitle = "Let's go!"
let textToShow = 0;

var SceneA = new Phaser.Class({

    Extends: Phaser.Scene,
    initialize:

    function SceneA ()
    {
        Phaser.Scene.call(this, { key: 'titleScreen' });
    },

    preload: function ()
    {
        this.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command_yellow.png', 'assets/fonts/carrier_command.xml');
        this.load.image('bg', 'assets/bg720-intro.png');
        this.load.image('terra4', 'assets/terra-camada4.png');
        this.load.image('terra3', 'assets/terra-camada3.png');
        this.load.image('terra2', 'assets/terra-camada2.png');
        this.load.image('terra1', 'assets/terra-camada1.png');
        this.load.image('terra', 'assets/terrinha.png');
        this.load.image('name', 'assets/SPACEGARI-TITLE.png');
        this.load.image('bg_stars', 'assets/bg-estrelas.png');
        this.load.image('gari','assets/astrogari.png');
        this.load.image('button', 'assets/playbutton.png');
    },

    create: function ()
    {
        this.cameras.main.setBackgroundColor('rgb(0,0,85)');
        face = this.add.image(window.innerWidth/2,window.innerHeight/2, 'bg');
        face.setScale(1.5);
        bg_stars = this.add.image(window.innerWidth/2, window.innerHeight/4, 'bg_stars');
        bg_stars.setScale(1);
        terra4 = this.add.image(window.innerWidth/2,window.innerHeight/1.5, 'terra4');
        terra4.setScale(0.5);
        terra3 = this.add.image(window.innerWidth/2,window.innerHeight/1.5, 'terra3');
        terra3.setScale(0.5);
        terra2 = this.add.image(window.innerWidth/2,window.innerHeight/1.5, 'terra2');
        terra2.setScale(0.5);
        terra1 = this.add.image(window.innerWidth/2,window.innerHeight/1.5, 'terra1');
        terra1.setScale(0.5);
        terra = this.add.image(window.innerWidth/2,window.innerHeight/1.5, 'terra');
        terra.setScale(0.5);
        namevariable = this.add.image(window.innerWidth/2, window.innerHeight/4, 'name');
        namevariable.setScale(0.75);
        gari = this.add.image(window.innerWidth/4, window.innerHeight/1.5, 'gari');
        button = this.add.image(window.innerWidth/1.3, window.innerHeight/1.5, 'button');
        button.setScale(0.4);
        button.setDepth(1);
        button.setInteractive();
        button.on('pointerdown', function () {

            console.log('From SceneA to SceneB');

            this.scene.start('game');

        }, this);

        // this.input.once('pointerdown', function () {

        //     console.log('From SceneA to SceneB');

        //     this.scene.start('game');

        // }, this);
    }

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
            textLife: null,
            textDebris: null
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
        this.add.bitmapText(width/2, height/2+50+offY, 'carrier_command','Press F5 to restart', 14).setOrigin(0.5);
        this.add.bitmapText(width/2, height/2+150+offY, 'carrier_command','TOP PLAYERS', 15).setOrigin(0.5);
        var person = prompt("Please enter your name", sessionStorage.getItem('name') || '');
        
        if (person != null && score > 0) {
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
        
        this.input.once('pointerdown', function () {

            console.log('From SceneC to SceneB');

            this.scene.stop('GameOver');
            window.location.reload();


        }, this);
    }
}

class SceneD extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'Text' });
    }

    create ()
    {
        let {width, height} = self.sys.game.canvas;
        let rect = new Phaser.Geom.Rectangle(0, 0, width, height);

        this.cameras.main.setBackgroundColor('rgb(0,0,85)');
        face = this.add.image(window.innerWidth/2,window.innerHeight/2, 'bg');
        face.setScale(1.5);

        let offY = -100;
        this.add.bitmapText(width/2, height/2-100+offY, 'carrier_command',textTitle, 44).setOrigin(0.5);
        this.add.image(window.innerWidth/6, window.innerHeight/1.3, 'gari');
        let i = 1;
        for (let text of textsToShow[textToShow]) {
            this.add.bitmapText(width/2, height/2+offY+i*25, 'carrier_command',text, 10).setOrigin(0.5);
            i++;
        }

        this.add.bitmapText(width/2, height/2+offY+20+i*25, 'carrier_command',"Click to resume", 8).setOrigin(0.5);

        this.input.once('pointerdown', function () {

            console.log('From SceneC to SceneB');

            this.scene.stop('Text');
            togglePause();


        }, this);
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
    scene: [SceneA, SceneB, SceneC, SceneD]
};

let game = new Phaser.Game(config);

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

// Deprecated
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
    self.cameras.main.setBackgroundColor('rgb(20,0,35)');
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
    life.create(50, 50, 'vida').setScale(0.15).refreshBody();

    // ================ CREATE STARFIELD ======================
    // createStarfield.bind(this)();

    ship = self.physics.add.sprite(85, 300, 'nave');

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
    player.setScale(0.35);

    // ================ COLLISION ============================================
    // self.physics.add.collider(player, ship);

    // ================ CONTROLS ============================================
    cursors = self.input.keyboard.createCursorKeys();

    // ================ SCORE =========================
    self.text = self.add.text(40, 20, '', { font: '16px Courier', fill: '#ffca5f' }).setDepth(1).setScrollFactor(0);
    self.textAltitude = self.add.text(40, height-40, '', { font: '16px Courier', fill: '#ffca5f' }).setDepth(1).setScrollFactor(0);
    self.textLife = self.add.text(55, 45, '', { font: '16px Courier', fill: '#ffca5f' }).setDepth(1).setScrollFactor(0);
    self.textDebris = self.add.text(width-320, height-40, '', { font: '16px Courier', fill: '#ffca5f' }).setDepth(1).setScrollFactor(0);

    self.textDebris.setText("Debris near your altitude: 1017");
    setTimeout(() => {
        togglePause();

    }, 200);
    game.scene.run('Text');
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

        child.setScale(0.3);
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
let shipChangeScore = 5000;
let altitudeChangeScore = 1;
let lifeUpScore = 20;
let altitudeIncrement = 500;
let spawnRate = 1000;
let starRate = 100;
let junkMinVelocity = -500;
let junkMaxVelocity = -800;
let starsMinVelocity = -30;
let starsMaxVelocity = -500;

function scoring (player, junk)
{
    score++;

    console.log(altitude);

    switch(altitude) {
        case 500 : self.textDebris.setText("Debris near your altitude: 1017");
                   break;
        case 1000 : self.textDebris.setText("Debris near your altitude: 8557");
                   break;
        case 2000 : self.textDebris.setText("Debris near your altitude: 1650");
                   break;
        case 3000 : self.textDebris.setText("Debris near your altitude: 54");
                   break;
        case 5000 : self.textDebris.setText("Debris near your altitude: 107");
                   break;
        case 10000 :
        default:    self.textDebris.setText("Debris near your altitude: 370");
                   break;
    }
    
    if (score-scoreOld == altitudeChangeScore) {
        scoreOld = score;
        altitude += altitudeIncrement;
        junkMinVelocity -=50;
        junkMaxVelocity -=50;
        starRate += 500;
        spawnRate += 200;
        starsMinVelocity += -50;
        starsMaxVelocity += -50;
    }

    if (altitude == shipChangeScore) {    
        ship.setTexture('nave2');
        altitudeOld = altitude;
        textToShow = 1;
        textTitle = "Mission Complete!"
        setTimeout(() => {
            togglePause();

        }, 200);
        game.scene.run('Text');
    }

    if (altitude == 2*shipChangeScore) {  
        ship.setTexture('nave3');
        ship.x = 0;

        altitudeOld = altitude;
        textToShow = 2;
        textTitle = "Mission Complete!"
        setTimeout(() => {
            togglePause();

        }, 200);
        game.scene.run('Text');
    }

    if (score-scoreLife == lifeUpScore) {
        scoreLife = score;
        hp++;
    }

    if (score == 20) {
        nave = 2;
        player.setScale(0.75);
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
        player.setAccelerationY(400);

        player.anims.play('down'+nave, true);

        if (!sounds.movimento.isPlaying)
            sounds.movimento.play();
    }
    else if (cursors.up.isDown)
    {
        player.setAccelerationY(-400);

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

    if (lastUpdateTime < Date.now() - spawnRate) {
        let junkindex = Phaser.Math.FloatBetween(0, 4);
        spawn.bind(this, width+100, junkMinVelocity, junkMaxVelocity, junkType[junkindex.toFixed(0)], 'lixo', true)();
        lastUpdateTime = Date.now();
    }

    if (lastUpdateTimeStars < Date.now() - starRate) {
        spawn.bind(this, width+100, starsMinVelocity, starsMaxVelocity, 'star', false)();
        lastUpdateTimeStars = Date.now();
    }
    
    ship.setVelocityY(ship.dir == 1 ? 50 : -50);

    if (ship.y > height - ship.height / 2 && ship.dir == 1 || ship.y < ship.height / 2 && ship.dir == -1){
        ship.dir = ship.dir == 1 ? -1 : 1;
    }
}