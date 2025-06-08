class Level3_1 extends Phaser.Scene {
    constructor() {
        super("level3_1");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 1000;
        this.DRAG = 600;   
        this.physics.world.gravity.y = 1400;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
        this.PLAYERSCORE = 0;
        this.die = false;
        this.hasKey = false;
        this.doorUnlocked = false;
        this.playerNearDoor = false;
        this.jumpCount = 0;
        this.maxJumps = 2;
        this.sceneChanging = false;
    }

    create() {
        // Add sounds to registry 
        this.registry.set("bgm", this.sound.add("music", { loop: true, volume: 0.5}));
        this.registry.get("bgm").play();

        this.registry.set("snore", this.sound.add("snoring", { loop: true}));

        //Background Elements
        let backdrop = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0xFFFFFF).setOrigin(0, 0).setScrollFactor(0).setDepth(-11);
        let sky = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0xff9633, 0.9).setOrigin(0, 0).setScrollFactor(0).setDepth(-11);

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
        this.map = this.add.tilemap("Festive_Farms", 18, 18, 90, 40);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.kennyTileset = this.map.addTilesetImage("kenny_tilemap_packed", "kenny_tilemap_tiles");
        this.foodTileset = this.map.addTilesetImage("farm_tilemap_packed", "farm_tilemap_tiles");

        // Create a layer
        this.layer1 = this.map.createLayer("Layer1", this.foodTileset, 0, 0);
        this.layer2 = this.map.createLayer("Layer2", this.foodTileset, 0, 0);
        this.layer3 = this.map.createLayer("Layer3", this.foodTileset, 0, 0);

        // Make it collidable
        this.layer2.setCollisionByProperty({
            collides: true
        });
        this.layer3.setCollisionByProperty({
            collides: true,
            spikes: true
        });

        // Create Objects
        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "kenny_tilemap_sheet",
            frame: 151
        });
        this.door = this.map.createFromObjects("Objects", {
            name: "door",
            key: "farm_tilemap_sheet",
            frame: 101
        });
        let keyObj = this.map.createFromObjects("Objects", {
            name: "key",
            key:"kenny_tilemap_sheet",
            frame: 27,
        });

        // Key visuals
        this.key = keyObj[0];
        this.physics.world.enable(this.key, Phaser.Physics.Arcade.STATIC_BODY);

        this.tweens.add({
            targets: this.key,
            y: this.key.y - 3,         
            duration: 800,               
            yoyo: true,                  
            repeat: -1,   
            ease: 'Sine.easeInOut'        
        });

        // Add physics
        this.physics.world.enable(this.door, Phaser.Physics.Arcade.STATIC_BODY);
        this.doorGroup = this.add.group(this.door);

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels + 100);
        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(this.coins);

        // Spawn point
        let spawnPoint = this.map.findObject("Objects", obj => obj.name === "PlayerSpawn");

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "platformer_characters", "tile_0006.png");
        my.sprite.player.setCollideWorldBounds(true);

        my.sprite.player.setMaxVelocity(300, 700); 


        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.layer2);
        this.physics.add.collider(my.sprite.player, this.layer3);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');
        this.vKey = this.input.keyboard.addKey('V');
        this.eKey = this.input.keyboard.addKey('E');
        this.teleportKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // VFX
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            random:true,
            scale: {start: 0.03, end: 0.05},
            maxAliveParticles: 4,
            lifespan: 350,
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

        // Key/Door implementing
        this.physics.add.overlap(my.sprite.player, this.key, (player, key) => {
            if (!this.hasKey) {
                this.hasKey = true;
                this.sound.play("key");  
                this.key.body.enable = false; 
            }
        });

        this.physics.add.overlap(my.sprite.player, this.door, (player, door) => {
            this.playerNearDoor = true;
            if (this.hasKey) {
                this.canUnlockDoor = true;
                this.currentDoor = door;  
            }
        });
        
        //Hints

        this.doorHint = this.add.text(0, 0, 'E to Unlock', {
            fontSize: '12px',
            color: '#ffffff',
            fontFamily: "'Chewy'",
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }).setOrigin(0.5)
          .setVisible(false); 

        this.doorHint2 = this.add.text(0, 0, 'SPACE to Enter', {
            fontSize: '12px',
            color: '#ffffff',
            fontFamily: "'Chewy'",
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }).setOrigin(0.5)
          .setVisible(false); 

          this.doorHint3 = this.add.text(0, 0, 'You need a key to Unlock!', {
            fontSize: '12px',
            color: '#ba0000',
            fontFamily: "'Chewy'",
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }).setOrigin(0.5)
          .setVisible(false); 

        // Camera Settings
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); 
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        // Score
        this.scoreText = this.add.text(380, 240, "Score: 0", {
            fontFamily: "'Chewy",
            fontSize: '14px',
            fill: '#ffffff'
        }).setScrollFactor(0);

        // Drop menu
        this.menu = this.add.container(this.scale.width / 2, this.scale.height / 2); 
    
        let bg = this.add.rectangle(0, 0, 350, 250, 0x000000, 0.8);
        bg.setOrigin(0.5).setScrollFactor(0);

        let menuText = this.add.text(0, -70, 'Paused', { fontSize: '32px', color: '#ffffff', fontFamily: "'Chewy'"}).setOrigin(0.5).setScrollFactor(0);
        let resumeText = this.add.text(0, -40, 'Click (ESC) to Resume', { fontSize: '16px', color: '#ffffff', fontFamily: "'Chewy'" }).setOrigin(0.5).setScrollFactor(0);

        let restartButton = this.add.text(0, 0, 'Restart Level', { fontSize: '24px', color: '#ffaaaa', fontFamily: "'Chewy'" }).setOrigin(0.5);
        restartButton.setScrollFactor(0).setInteractive({ useHandCursor: true });

        restartButton.on('pointerdown', () => {
            this.sound.play("select");
            this.registry.get("bgm").stop();
            this.scene.stop();         
            this.scene.restart(); 
        });

        restartButton.on('pointerover', () => {
            this.sound.play("rollover");
            restartButton.setAlpha(0.5);
        });
        restartButton.on('pointerout', () => {
            restartButton.setAlpha(1);
        });

        let backButton = this.add.text(0, 60, 'Back to Main Menu', { fontSize: '24px', color: '#ffaaaa', fontFamily: "'Chewy'" }).setOrigin(0.5);
        backButton.setScrollFactor(0).setInteractive({ useHandCursor: true });

        backButton.on('pointerdown', () => {
            this.sound.play("select");
            this.registry.get("bgm").stop();
            this.scene.stop();         
            this.scene.start('mainMenu'); 
        });

        backButton.on('pointerover', () => {
            this.sound.play("rollover");
            backButton.setAlpha(0.5);
        });
        backButton.on('pointerout', () => {
            backButton.setAlpha(1);
        });

        let levelButton = this.add.text(0, 30, 'Level Select', { fontSize: '24px', color: '#ffaaaa', fontFamily: "'Chewy'" }).setOrigin(0.5);
        levelButton.setScrollFactor(0).setInteractive({ useHandCursor: true });

        levelButton.on('pointerdown', () => {
            this.sound.play("select");
            this.registry.get("bgm").stop();
            this.scene.stop();         
            this.scene.start('levelSelect'); 
        });

        levelButton.on('pointerover', () => {
            this.sound.play("rollover");
            levelButton.setAlpha(0.5);
        });
        levelButton.on('pointerout', () => {
            levelButton.setAlpha(1);
        });

        this.menu.add([bg, menuText, resumeText, backButton, levelButton, restartButton]);

        this.menu.setVisible(false);

        this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.menuVisible = false;

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

            // Jump
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
            
            // Double Jump
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

            // Falling out of the world
            if (!this.die && my.sprite.player.y > this.map.heightInPixels + 10) {
                this.die = true; 
                this.sound.play("death");
                this.registry.get("bgm").stop();
                this.cameras.main.fadeOut(600, 0, 0, 0);

                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.restart();
                });
            }

            // Set max speed
            let maxSpeed = 250;  

            if (my.sprite.player.body.velocity.x > maxSpeed) {
                my.sprite.player.body.velocity.x = maxSpeed;
            }
            if (my.sprite.player.body.velocity.x < -maxSpeed) {
                my.sprite.player.body.velocity.x = -maxSpeed;
            }

            // Key follows character
            if (this.hasKey) {
                let targetX = my.sprite.player.x - 10;
                let targetY = my.sprite.player.y - 10;
            
                this.key.x += (targetX - this.key.x) * 0.3;
                this.key.y += (targetY - this.key.y);
            }

            //Door Hints
            this.playerNearDoor = false;

            this.physics.overlap(my.sprite.player, this.doorGroup, (player, door) => {
                this.playerNearDoor = true;
                this.currentDoor = door; 
            });

            if (this.playerNearDoor && !this.canUnlockDoor && !this.doorUnlocked) {
                this.doorHint3.setVisible(true);
                this.doorHint3.x = this.currentDoor.x;
                this.doorHint3.y = this.currentDoor.y - 20;
            } else {
                this.doorHint3.setVisible(false);
            }

            if (this.playerNearDoor && this.canUnlockDoor) {
                this.doorHint.setVisible(true);
                this.doorHint.x = this.currentDoor.x;
                this.doorHint.y = this.currentDoor.y - 20;
            } else {
                this.doorHint.setVisible(false);
            }

            if (this.playerNearDoor && this.doorUnlocked) {
                this.doorHint2.setVisible(true);
                this.doorHint2.x = this.currentDoor.x;
                this.doorHint2.y = this.currentDoor.y - 20;
            } else {
                this.doorHint2.setVisible(false);
            }
            // Unlocks door if character has key
            if (this.canUnlockDoor && this.hasKey && Phaser.Input.Keyboard.JustDown(this.eKey)) {
                console.log("Unlocking door!");
                this.sound.play("doorUnlock");
                this.currentDoor.setFrame(97);  
                this.hasKey = false; 
                this.key.visible = false;
                this.key.destroy();
                this.canUnlockDoor = false;  
                this.doorUnlocked = true;
            }

            if (this.canUnlockDoor && !this.physics.overlap(my.sprite.player, this.currentDoor)) {
                this.canUnlockDoor = false;
                this.currentDoor = null;
            }

            if(this.doorUnlocked && Phaser.Input.Keyboard.JustDown(this.teleportKey)) {
                if (this.sceneChanging) return;
                this.sceneChanging = true;

                this.time.delayedCall(1000, () => {
                    this.cameras.main.fadeOut(800, 0, 0, 0);
            
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.registry.set("score", this.PLAYERSCORE);
                        this.registry.set("previousScene", this.scene.key);
                        this.scene.start("level3_2");
                    });
                });
            }
            
            // Drop menu pauses world
            if (Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
                this.menuVisible = !this.menuVisible;
                this.menu.setVisible(this.menuVisible);
            
                if (this.menuVisible) {
                    this.physics.world.pause(); 
                } else {
                    this.physics.world.resume();
                }
            }
            
    }
    
    
}