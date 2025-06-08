class Level2 extends Phaser.Scene {
    constructor() {
        super("level2");
    }

    init() {
        this.ACCELERATION = 600;
        this.DRAG = 600;  
        this.physics.world.gravity.y = 1400;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
        this.PLAYERSCORE = 0;
        this.jumpCount = 0;
        this.maxJumps = 2;
        this.sceneChanging = false;
        this.playerNearDoor = false;
    }

    create() {
        // Background audio
        this.bgm = this.sound.add('music', {
            loop: true,
            volume: 0.5
        });
        this.bgm.play();

        this.registry.set("snore", this.sound.add("snoring", { loop: true}));

        //Background Elements
        let sky = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x61462c, 0.9).setOrigin(0, 0).setScrollFactor(0).setDepth(-11);

        this.add.image(0, 300, "cloud").setOrigin(0, 0).setScrollFactor(0.1).setDepth(-10).setScale(1.2).setAlpha(0.3);
        this.add.image(1199, 300, "cloud").setOrigin(0, 0).setScrollFactor(0.1).setDepth(-10).setScale(1.2).setAlpha(0.3);
        this.add.rectangle(0, 546, this.cameras.main.width, 100, 0xFFFFFF).setOrigin(0,0).setDepth(-10).setScrollFactor(0.1).setAlpha(0.3);
        this.add.image(-50, 350, "cloud").setOrigin(0, 0).setScrollFactor(0.1).setDepth(-10).setScale(2).setAlpha(0.8);

        this.add.image(0, 595, "hills").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-9);
        this.add.image(1000, 595, "hills").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-9);


        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 90 tiles wide and 40 tiles tall.
        this.map = this.add.tilemap("Metal_Mayhem", 18, 18, 90, 40);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.kennyTileset = this.map.addTilesetImage("kenny_tilemap_packed", "kenny_tilemap_tiles");
        this.industrialTileset = this.map.addTilesetImage("industrial_tilemap_packed", "industrial_tilemap_packed");

        // Create a layer
        this.layer1 = this.map.createLayer("Layer1", this.industrialTileset, 0, 0);
        this.layer2 = this.map.createLayer("Layer2", this.industrialTileset, 0, 0);
        this.layer3 = this.map.createLayer("Layer3", this.industrialTileset, 0, 0);

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

        // Create Objects
        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "kenny_tilemap_sheet",
            frame: 151
        });

        this.bed = this.map.createFromObjects("Objects", {
            name: "bed",
            key: "bed_tilemap_sheet",
            frame: 0
        });

        // Physics
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels + 100);
        
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(this.coins);

        let spawnPoint = this.map.findObject("Objects", obj => obj.name === "PlayerSpawn");

        this.physics.world.enable(this.bed, Phaser.Physics.Arcade.STATIC_BODY);
        this.bedGroup = this.add.group(this.bed);

        // Doors setup
        this.doors = this.map.createFromObjects("Doors", {
             name: "door", 
             key: "industrial_tilemap_sheet", 
             frame: 28 
        });

        this.doors.forEach(door => {
            this.physics.world.enable(door, Phaser.Physics.Arcade.STATIC_BODY);
            door.doorNum = door.data?.get("number") || 0;
            door.linkedTo = door.data?.get("linkedTo") || 0;
            console.log(`Loaded door: doorNum=${door.doorNum} → linkedTo=${door.linkedTo}`);
        });
        
        this.doorGroup = this.add.group(this.doors);
        
        this.teleportKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        

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

        my.vfx.disintegrate = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            scale: { start: 0.07, end: 0 },
            lifespan: 300,
            speed: { min: -100, max: 100 },
            gravityY: -50,
            alpha: { start: 0.5, end: 0 }
        });
        my.vfx.disintegrate.stop();

        // Winning condition
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
                    this.registry.set("previousScene", this.scene.key);
                    this.scene.start("victoryScene");
                });
            });
        });

        // Door opens when player walks over it
        this.physics.add.overlap(my.sprite.player, this.doorGroup, (player,door) => {
            this.playerNearDoor = true;
            door.setFrame(44);
            this.currentDoor = door;
        });
        
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
            this.bgm.stop();
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
            this.bgm.stop();
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
            this.bgm.stop();
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

        //Door Hint
        this.doorHint = this.add.text(0, 0, 'SPACE to Enter', {
            fontSize: '12px',
            color: '#ffffff',
            fontFamily: "'Chewy'",
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }).setOrigin(0.5)
          .setVisible(false); 

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

            // Set max speed
            let maxSpeed = 300;  

            if (my.sprite.player.body.velocity.x > maxSpeed) {
                my.sprite.player.body.velocity.x = maxSpeed;
            }
            if (my.sprite.player.body.velocity.x < -maxSpeed) {
                my.sprite.player.body.velocity.x = -maxSpeed;
            }

            // Falling in acid implementing
            const tile = this.layer1.getTileAtWorldXY(
                my.sprite.player.x,
                my.sprite.player.y + my.sprite.player.height,
                true
            );

            if (tile && tile.properties.acid && !this.sceneChanging) {
                this.sceneChanging = true;
            
                this.sound.stopByKey('music');
                my.vfx.disintegrate.emitParticleAt(my.sprite.player.x, my.sprite.player.y, 50);
                my.sprite.player.setVisible(false);
                this.sound.play("acidBurn");
                my.sprite.player.anims.stop();
                this.cameras.main.shake(250, 0.01); 
                this.cameras.main.fadeOut(1000, 0, 0, 0);
            
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.restart();
                });
            }
             
            // Teleports player 
            if (this.currentDoor && Phaser.Input.Keyboard.JustDown(this.teleportKey)) {
                this.teleportToDoor(this.currentDoor.linkedTo);
            }
    
            if (this.currentDoor && !this.physics.overlap(my.sprite.player, this.currentDoor)) {
                this.currentDoor.setFrame(28);
                this.currentDoor = null;
            }

            // Drop menu pauses game
            if (Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
                this.menuVisible = !this.menuVisible;
                this.menu.setVisible(this.menuVisible);
            
                if (this.menuVisible) {
                    this.physics.world.pause(); 
                } else {
                    this.physics.world.resume();
                }
            }

            //Door Hint
            this.playerNearDoor = false;

            this.physics.overlap(my.sprite.player, this.doorGroup, (player, door) => {
                this.playerNearDoor = true;
                this.currentDoor = door; 
            });

            if (this.playerNearDoor) {
                this.doorHint.setVisible(true);
                this.doorHint.x = this.currentDoor.x;
                this.doorHint.y = this.currentDoor.y - 20;
            } else {
                this.doorHint.setVisible(false);
            }

    }

    // Binds doors to each other
    teleportToDoor(targetName) {
        let targetDoor = this.doorGroup.getChildren().find(door => door.doorNum === targetName);
        if (targetDoor) {
            my.sprite.player.x = targetDoor.x;
            my.sprite.player.y = targetDoor.y;
            console.log(`Teleported to ${targetName}`);
        } else {
            console.warn(`No door found with number: ${targetName}`);
        }
    }
}