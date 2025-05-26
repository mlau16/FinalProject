class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 400;
        this.DRAG = 600;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1400;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
        this.PLAYERSCORE = 0;
        this.die = false;
        this.jumpCount = 0;
        this.maxJumps = 2;
    }

    create() {
        
        this.bgm = this.sound.add('music', {
            loop: true,
            volume: 0.5
        });
        this.bgm.play();

        this.registry.set("snore", this.sound.add("snoring", { loop: true}));

        let backdrop = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0xFFFFFF).setOrigin(0, 0).setScrollFactor(0).setDepth(-11);
        let sky = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0xFFB6C1, 0.9).setOrigin(0, 0).setScrollFactor(0).setDepth(-11);

        this.add.image(0, 300, "cloud").setOrigin(0, 0).setScrollFactor(0.1).setDepth(-10).setScale(1.2).setAlpha(0.3);
        this.add.image(1199, 300, "cloud").setOrigin(0, 0).setScrollFactor(0.1).setDepth(-10).setScale(1.2).setAlpha(0.3);
        this.add.rectangle(0, 546, this.cameras.main.width, 100, 0xFFFFFF).setOrigin(0,0).setDepth(-10).setScrollFactor(0.1).setAlpha(0.3);
        this.add.image(-50, 350, "cloud").setOrigin(0, 0).setScrollFactor(0.1).setDepth(-10).setScale(2).setAlpha(0.8);

        this.add.image(0, 595, "hills").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-9);
        this.add.image(1000, 595, "hills").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-9);

        this.add.image(150, 510, "tree1").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-8).setScale(0.4);
        this.add.image(300, 580, "tree1").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-8).setScale(0.3);
        this.add.image(1050, 550, "tree1").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-8).setScale(0.2);
        this.add.image(1100, 530, "tree1").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-8).setScale(0.3);




        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 90 tiles wide and 40 tiles tall.
        this.map = this.add.tilemap("Napstronaut_Map", 18, 18, 90, 40);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.kennyTileset = this.map.addTilesetImage("kenny_tilemap_packed", "kenny_tilemap_tiles");
        this.foodTileset = this.map.addTilesetImage("food_tilemap_packed", "food_tilemap_tiles");

        // Create a layer
        this.layer1 = this.map.createLayer("Layer1", this.foodTileset, 0, 0);
        this.layer2 = this.map.createLayer("Layer2", this.foodTileset, 0, 0);
        this.layer3 = this.map.createLayer("Layer3", this.foodTileset, 0, 0);

        this.spikeTiles = this.layer3.filterTiles(tile => tile.properties.spikes);


        // Make it collidable
        this.layer1.setCollisionByProperty({
            collides: true
        });
        this.layer2.setCollisionByProperty({
            collides: true
        });
        this.layer3.setCollisionByProperty({
            collides: true,
            spikes: true
        });

        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "kenny_tilemap_sheet",
            frame: 151
        });

        this.bed = this.map.createFromObjects("Objects", {
            name: "bed",
            key: "bed_tilemap_sheet",
            frame: 0
        })

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels + 100);
        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(this.coins);

        let spawnPoint = this.map.findObject("Objects", obj => obj.name === "PlayerSpawn");

        this.physics.world.enable(this.bed, Phaser.Physics.Arcade.STATIC_BODY);
        this.bedGroup = this.add.group(this.bed);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "platformer_characters", "tile_0006.png");
        my.sprite.player.setCollideWorldBounds(true);

        my.sprite.player.setMaxVelocity(300, 700); 


        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.layer1);
        this.physics.add.collider(my.sprite.player, this.layer2);
        this.physics.add.collider(my.sprite.player, this.layer3);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');
        this.vKey = this.input.keyboard.addKey('V');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // movement vfx

        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            // TODO: Try: add random: true
            random:true,
            scale: {start: 0.03, end: 0.05},
            // TODO: Try: maxAliveParticles: 8,
            maxAliveParticles: 4,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            alpha: {start: 0.5, end: 0.1}, 
        });

        my.vfx.walking.stop();

        this.physics.add.overlap(my.sprite.player, this.coinGroup, (player, coin) => {
            my.vfx.coin.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.coin.emitParticleAt(coin.x, coin.y, 15);
            this.sound.play("clink");
            this.PLAYERSCORE += 10;
            this.scoreText.setText("Score: " + this.PLAYERSCORE);
            coin.destroy(); 
        });

        this.coins.forEach(coin => {
            coin.anims.play('spin');
        });

        my.vfx.coin = this.add.particles(0, 0, "kenny-particles", {
            frame: ['star_01.png', 'star_03.png'],
            scale: {start: 0.03, end: 0.25},
            maxAliveParticles: 4,
            lifespan: 350,
            gravityY: -100,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.coin.stop();

        this.physics.add.overlap(my.sprite.player, this.bedGroup, () => {
            if (this.sceneChanging) return;
            this.sceneChanging = true;
            this.tweens.add({
                targets: this.bgm,      
                volume: 0,              
                duration: 1000,        
                onComplete: () => {
                    this.bgm.stop();   
                }
            });
            this.registry.get("snore").play();
            this.time.delayedCall(1000, () => {
                this.cameras.main.fadeOut(800, 0, 0, 0);

                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.registry.set("score", this.PLAYERSCORE);
                    this.scene.start("victoryScene");
                });
            });
        });
        
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); 
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        this.scoreText = this.add.text(380, 240, "Score: 0", {
            fontFamily: "'Chewy",
            fontSize: '14px',
            fill: '#ffffff'
        }).setScrollFactor(0);

    }

    update() {
        
            // Left/right movement
            if(cursors.left.isDown) {
                my.sprite.player.setAccelerationX(-this.ACCELERATION);
                my.sprite.player.resetFlip();
                my.sprite.player.anims.play('walk', true);
                if (my.sprite.player.body.blocked.down) {
                    my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
                    my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
                    my.vfx.walking.start();
                }
            } else if(cursors.right.isDown) {
                my.sprite.player.setAccelerationX(this.ACCELERATION);
                my.sprite.player.setFlip(true, false);
                my.sprite.player.anims.play('walk', true);
                if (my.sprite.player.body.blocked.down) {
                    my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
                    my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
                    my.vfx.walking.start();
                }
            } else {
                my.sprite.player.setAccelerationX(0);
                my.sprite.player.setDragX(this.DRAG);
                my.sprite.player.anims.play('idle');
                my.vfx.walking.stop();
            }

        
            if(!my.sprite.player.body.blocked.down) {
                my.sprite.player.anims.play('jump');
            }

            if (my.sprite.player.body.blocked.down) {
                this.jumpCount = 0;
                this.jumpReleased = true;  
            }
    
            if (!cursors.up.isDown) {
                this.jumpReleased = true;
            }
    
            if (Phaser.Input.Keyboard.JustDown(cursors.up) && this.jumpCount === 0) {
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                this.sound.play("jump");
                this.jumpCount++;
                this.jumpReleased = false;
            } else if (cursors.up.isDown && this.jumpCount === 1 && this.jumpReleased) {
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                this.sound.play("jump");
                this.jumpCount++;
                this.jumpReleased = false;
            }

            if (!this.die && my.sprite.player.y > this.map.heightInPixels + 10) {
                this.die = true; 
                this.sound.play("death");
                this.bgm.stop();
                this.cameras.main.fadeOut(600, 0, 0, 0);

                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.restart();
                });
            }

            let maxSpeed = 300;  

            if (my.sprite.player.body.velocity.x > maxSpeed) {
                my.sprite.player.body.velocity.x = maxSpeed;
            }
            if (my.sprite.player.body.velocity.x < -maxSpeed) {
                my.sprite.player.body.velocity.x = -maxSpeed;
            }

            if (!this.die) {
                const tile = this.layer3.getTileAtWorldXY(
                    my.sprite.player.x,
                    my.sprite.player.y + my.sprite.player.height,
                    true
                );
                if (tile && tile.properties.spikes) {
                    if (this.die) return; 
                
                    this.die = true;
                    this.sound.play("death");
                    this.bgm.stop();
                    this.cameras.main.shake(250, 0.01); 
                    this.cameras.main.fadeOut(1000, 0, 0, 0);
                
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.restart();
                    });
                }
            }
    }
    
}