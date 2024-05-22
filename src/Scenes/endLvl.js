class endLvl extends Phaser.Scene {
    constructor() {
        super("platformerScene4");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 650;
        this.DRAG = 700;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -500;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2;
        this.checkpoint = false;
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("theEnd", 18, 18, 45, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("Kenny_tilemap_packed", "tilemap_tiles");
        
        // Create a layer
        this.backgroundLayer = this.map.createLayer("background", this.tileset2, 0, 0);
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        
        this.startKey = this.input.keyboard.addKey("R");

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.coins = this.map.createFromObjects("Collectables", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });

        this.SpawnPoint = this.map.createFromObjects("Spawn", {
            name: "spawnPoint",
            key: "tilemap_sheet",
            frame: 112
        });

        this.respawn = this.map.createFromObjects("Spawn", {
            name: "respawn",
            key: "tilemap_sheet",
            frame: 112
        });

        this.door = this.map.createFromObjects("Level-Exit", {
            name: "Door",
            key: "tilemap_sheet2",
            frame: 150
        });

        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(this.coins);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(70, 70, "platformer_characters", "tile_0002.png");
        my.sprite.player.setCollideWorldBounds(true);

        this.coinTxt = this.add.bitmapText(my.sprite.player.x - 5, my.sprite.player.y - 10, 'Ariel', " Final coins score: " + coinScore);
        this.coinTxt.setScale(0.3);

        this.restartTxt = this.add.bitmapText(my.sprite.player.x - 5, my.sprite.player.y - 10, 'Ariel', "press R to restart");
        this.restartTxt.setScale(0.2);

        this.endTxt = this.add.bitmapText(my.sprite.player.x - 5, my.sprite.player.y - 10, 'Ariel', "The End");

        my.sprite.player.setSize(18, 18);
        my.sprite.player.setOffset(3, 4);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        my.sprite.player.setSize(18, 18);
        
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            coinScore++;
            my.vfx.coinHit.start();
            my.vfx.coinHit.startFollow(obj2, obj2.displayWidth/2-10, obj2.displayHeight/2-5, false);
            my.vfx.coinHit.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        my.vfx.coinHit = this.add.particles(0, 0, "kenny-particles", {
            frame: ['magic_03.png', 'magic_04.png'],
            duration: 30,
            // TODO: Try: add random: true
            addRandom: true,
            scale: {start: 0.03, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            maxAliveParticles: 8,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            gravityY: -400,
            alpha: {start: 1, end: 0.1},
        });
        my.vfx.coinHit.stop();

        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['dirt_02.png', 'dirt_03.png'],
            // TODO: Try: add random: true
            addRandom: true,
            scale: {start: 0.03, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            maxAliveParticles: 3,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();

        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {
            frame: ['light_02.png', 'light_03.png'],
            // TODO: Try: add random: true
            addRandom: true,
            scale: {start: 0.03, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            maxAliveParticles: 10,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.jumping.stop();

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE * 1.3);
        
    }


    update() {
        this.coinTxt.y = my.sprite.player.y - 40;
        this.endTxt.y = my.sprite.player.y - 80;
        this.restartTxt.y = my.sprite.player.y - 20;
        if(this.startKey.isDown){
            stage = 0;
            coinScore = 0;
            doubleJump = false;
            secondJump = false;
            this.scene.start("platformerScene1");
        }
    }
}