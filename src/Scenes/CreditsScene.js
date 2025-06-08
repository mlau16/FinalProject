class CreditsScene extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create() {
        // Background movement
        this.cameras.main.setBounds(0, 0, 2000, 600);
        this.tweens.add({
        targets: this.cameras.main,
        scrollX: 400,
        duration: 3000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
        }); 

        // ackground Elements
        let backdrop = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0xFFFFFF).setOrigin(0, 0).setScrollFactor(0).setDepth(-11);
        let sky = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x41609e, 0.9).setOrigin(0, 0).setScrollFactor(0).setDepth(-11);

        this.backgroundPlayer = this.add.sprite(100, 300, "platformer_characters", "tile_0006.png");
        this.backgroundPlayer.setScale(2);  
        this.backgroundPlayer.setAlpha(1); 
        this.backgroundPlayer.setScrollFactor(0);

        this.tweens.add({
            targets: this.backgroundPlayer,
            y: '+=200',          
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: this.backgroundPlayer,
            x: '+=1200',         
            duration: 10000,     
            yoyo: true,         
            repeat: -1,       
            ease: 'Sine.easeInOut'
        });

        this.add.image(0, 615, "cloud").setOrigin(0, 0).setScrollFactor(0.1).setDepth(-10).setScale(1.2).setAlpha(0.3);
        this.add.image(1199, 615, "cloud").setOrigin(0, 0).setScrollFactor(0.1).setDepth(-10).setScale(1.2).setAlpha(0.3);
        this.add.rectangle(0, 861, this.cameras.main.width, 100, 0xFFFFFF).setOrigin(0,0).setDepth(-10).setScrollFactor(0.1).setAlpha(0.3);
        this.add.image(-50, 600, "cloud").setOrigin(0, 0).setScrollFactor(0.1).setDepth(-10).setScale(2).setAlpha(0.8);

        this.add.image(0, 800, "hills").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-9);
        this.add.image(1000, 800, "hills").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-9);

        this.add.image(150, 720, "tree1").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-8).setScale(0.4);
        this.add.image(300, 780, "tree1").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-8).setScale(0.3);
        this.add.image(1050, 750, "tree1").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-8).setScale(0.2);
        this.add.image(1100, 730, "tree1").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-8).setScale(0.3);

        // Credits box
        let bg = this.add.rectangle(720, 450, 920, 650, 0x000000, 0.5);

        bg.setScrollFactor(0);

        this.add.text(720, 200, 'Credits', { fontSize: '32px', color: '#ffffff', fontFamily: "'Chewy'"}).setOrigin(0.5).setScrollFactor(0);
        this.add.text(570, 250, 'Game Content', { fontSize: '20px', color: '#ffffff', fontFamily: "'Chewy'"}).setOrigin(0.5).setScrollFactor(0);
        this.add.text(870, 250, 'Mandy Lau', { fontSize: '20px', color: '#f2ecb1', fontFamily: "'Chewy'"}).setOrigin(0.5).setScrollFactor(0);

        this.add.text(570, 300, 'Assets', { fontSize: '20px', color: '#ffffff', fontFamily: "'Chewy'"}).setOrigin(0.5).setScrollFactor(0);
        this.add.text(870, 300, 'Kenney\'s Assets', { fontSize: '20px', color: '#f2ecb1', fontFamily: "'Chewy'"}).setOrigin(0.5).setScrollFactor(0);
        
        this.add.text(570, 350, 'Audio', { fontSize: '20px', color: '#ffffff', fontFamily: "'Chewy'"}).setOrigin(0.5).setScrollFactor(0);
        this.add.text(870, 375, '\"Game Music Loop 7\" by XtremeFreddy \n \"Pixel Explosion\" by Lumora_Studios \n \"Acid burn, sizzle 14\" by Zapsplat', { fontSize: '20px', color: '#f2ecb1', fontFamily: "'Chewy'"}).setOrigin(0.5).setScrollFactor(0);

        this.add.text(570, 350, '', { fontSize: '20px', color: '#ffffff', fontFamily: "'Chewy'"}).setOrigin(0.5).setScrollFactor(0);
        this.add.text(870, 375, '\"Game Music Loop 7\" by XtremeFreddy \n \"Pixel Explosion\" by Lumora_Studios \n \"Acid burn, sizzle 14\" by Zapsplat', { fontSize: '20px', color: '#f2ecb1', fontFamily: "'Chewy'"}).setOrigin(0.5).setScrollFactor(0);

        this.add.text(570, 440, 'Honorable Mention:', { fontSize: '20px', color: '#ffffff', fontFamily: "'Chewy'"}).setOrigin(0.5).setScrollFactor(0);
        this.add.text(870, 440, 'ChatGPT', { fontSize: '20px', color: '#f2ecb1', fontFamily: "'Chewy'"}).setOrigin(0.5).setScrollFactor(0);

        // Back Button
        let backText = this.add.text(720, 700, "Back to Main Menu", {
            fontSize: "24px",
            fontFamily: "'Chewy'",
            color: "#ff8888",
        }).setOrigin(0.5).setInteractive().setScrollFactor(0);

        backText.on('pointerover', () => {
            this.sound.play("rollover");
            backText.setAlpha(0.5);
        });
        backText.on('pointerout', () => {
            backText.setAlpha(1);
        });

        backText.on('pointerdown', () => {
            this.sound.play("select");
            this.scene.start("mainMenu");
        }).setScrollFactor(0);
    }
}
