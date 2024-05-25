class PlatformerLvl3 extends Phaser.Scene {
    constructor() {
        super("platformerScene3");
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
        this.textDuration = 90;
        this.frame = 0;
        this.secondJump = false;

    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-3", 18, 18, 45, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.tileset2 = this.map.addTilesetImage("tilemap_packed2", "tilemap_tiles2");
        
        // Create a layer
        this.backgroundLayer = this.map.createLayer("background", this.tileset2, 0, 0);
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        
        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.coins = this.map.createFromObjects("Collectables", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });

        this.power = this.map.createFromObjects("Collectables", {
            name: "powerup",
            key: "tilemap_sheet",
            frame: 67
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

        this.drowned = this.map.createFromObjects("InstantDeath", {
            name: "drown",
            key: "tilemap_sheet",
            frame: 1
        });

        this.door = this.map.createFromObjects("Level-Exit", {
            name: "Door",
            key: "tilemap_sheet2",
            frame: 150
        });

        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.drowned, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.power, Phaser.Physics.Arcade.STATIC_BODY);
        
        
        this.coinGroup = this.add.group(this.coins);
        this.drownGroup = this.add.group(this.drowned);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(this.SpawnPoint[0].x, this.SpawnPoint[0].y, "platformer_characters", "tile_0001.png");
        my.sprite.player.setCollideWorldBounds(false);
        my.sprite.player.body.maxVelocity.x = 250;

        this.movable = this.physics.add.sprite

        this.doorTxt = this.add.bitmapText(this.door[0].x - 15, this.door[0].y - 25, 'Ariel', "Door");
        this.doorTxt.setScale(0.3);

        this.coinTxt = this.add.bitmapText(my.sprite.player.x - 5, my.sprite.player.y - 10, 'Ariel', "coins: " + coinScore);
        this.coinTxt.setScale(0.3);

        this.checkText = this.add.bitmapText(this.respawn[0].x-25, this.respawn[0].y-15, 'Ariel', "Checkpoint!");
        this.checkText.setScale(0.3);
        this.checkText.visible = false;

        my.sprite.player.setSize(18, 18);
        my.sprite.player.setOffset(3, 4);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            coinScore++;
            my.vfx.coinHit.start();
            my.vfx.coinHit.startFollow(obj2, obj2.displayWidth/2-10, obj2.displayHeight/2-5, false);
            my.vfx.coinHit.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            
        });

        this.physics.add.overlap(my.sprite.player, this.power, (obj1, obj2) => {
            this.powerTxt = this.add.bitmapText(obj2.x, obj2.y, 'Ariel', "You just got the Double Jump!\n press jump while in midair!");
            this.powerTxt.setScale(0.3);
            obj2.destroy();
            doubleJump = true;
            my.vfx.powerup.start();
            my.vfx.powerup.startFollow(obj2, obj2.displayWidth/2-10, obj2.displayHeight/2-5, false);
            my.vfx.powerup.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
        });

        this.physics.add.overlap(my.sprite.player, this.drownGroup, (obj1, obj2) => {
            
            this.respawnPlayer();
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

        my.vfx.powerup = this.add.particles(0, 0, "kenny-particles", {
            //'spark_01.png', 'spark_02.png', 'spark_03.png', 'spark_04.png', 
            frame: ['spark_05.png', 'spark_06.png'],
            duration: 90,
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
        my.vfx.powerup.stop();

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE * 1.3);
        
    }

    hit(bullet, target){
        if (Math.abs(bullet.x - target.x) > (bullet.displayWidth/2 + target.displayWidth/2)){
            return false;
        }
        if (Math.abs(bullet.y - target.y) > (bullet.displayHeight/2 + target.displayHeight/2)){
            return false;
        }
        return true;
    }

    twoJump(){
        if(doubleJump == true && this.secondJump == true){
            if(!my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)){
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);

                this.sound.play("jumpsound");

                my.vfx.jumping.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
                my.vfx.jumping.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
                if (my.sprite.player.body.blocked.down) {
                    my.vfx.jumping.start();
                }
                this.secondJump = false;
            }
        }
        if(my.sprite.player.body.blocked.down){
            this.secondJump = true;
        }
    }

    respawnPlayer(){
        console.log("death");
        if(this.checkpoint == true){
            my.sprite.player.x = this.respawn[0].x;
            my.sprite.player.y = this.respawn[0].y - 70;
            my.sprite.player.setVelocity(0, 0);
        }
        else{
            my.sprite.player.x = this.SpawnPoint[0].x;
            my.sprite.player.y = this.SpawnPoint[0].y - 70;
            my.sprite.player.setVelocity(0, 0);
        }
        this.physics.world.gravity.y = 1500;
    }

    update() {
        this.frame++;
        this.coinTxt.setText("Score: " + coinScore);
        this.coinTxt.y = my.sprite.player.y - 25
        this.coinTxt.x = my.sprite.player.x - 15

        //left and right movement: 
        if(cursors.left.isDown) {
            // TODO: have the player accelerate to the left
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

            if(this.frame % 30 == 0){
                this.sound.play("walksound");
            }

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else if(cursors.right.isDown) {
            // TODO: have the player accelerate to the right
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

            if(this.frame % 30 == 0){
                this.sound.play("walksound");
            }

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else {
            // TODO: set acceleration to 0 and have DRAG take over
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            // TODO: set a Y velocity to have the player "jump" upwards (negative Y direction)
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);

            this.sound.play("jumpsound");

            my.vfx.jumping.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.jumping.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.jumping.start();
            }
        }
        else
        {
            my.vfx.jumping.stop();
        }
        if(doubleJump == true){
            this.twoJump();
        }
        if(my.sprite.player.y >= 1600){
            this.respawnPlayer();
        }
        if(this.hit(my.sprite.player, this.respawn[0])){
            this.checkpoint = true;
            this.checkText.visible = true;
        }
        if(this.hit(my.sprite.player, this.door[0])){
            this.scene.start("platformerScene4");
            console.log("door touch");
        }
    }
}