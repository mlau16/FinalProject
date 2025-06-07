// LevelSelect.js
class LevelSelect extends Phaser.Scene {
    constructor() {
        super("levelSelect");
    }

    create() {

        this.cameras.main.setBounds(0, 0, 2000, 600);
        this.tweens.add({
        targets: this.cameras.main,
        scrollX: 400,
        duration: 3000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
        }); 

        let backdrop = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0xFFFFFF).setOrigin(0, 0).setScrollFactor(0).setDepth(-11);
        let sky = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x41609e, 0.9).setOrigin(0, 0).setScrollFactor(0).setDepth(-11);

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
        

        this.add.text(720, 300, "Select a Level", {
            fontSize: "48px",
            fontFamily: "'Chewy'",
            color: "#ffffff",
        }).setOrigin(0.5).setScrollFactor(0);

        let backText = this.add.text(720, 800, "Back to Main Menu", {
            fontSize: "24px",
            fontFamily: "'Chewy'",
            color: "#ff8888",
        }).setOrigin(0.5).setInteractive().setScrollFactor(0);

        backText.on('pointerover', () => {
            backText.setAlpha(0.5);
        });
        backText.on('pointerout', () => {
            backText.setAlpha(1);
        });

        backText.on('pointerdown', () => {
            this.scene.start("mainMenu");
        }).setScrollFactor(0);

        this.add.text(360, 400, "Level 1", {
            fontSize: "36px",
            fontFamily: "'Chewy'",
            color: "#f2ecb1",
        }).setScrollFactor(0).setOrigin(0.5);

        let level1Button = this.add.sprite(360, 500, 'donut');
        level1Button.setInteractive()
        level1Button.setScrollFactor(0)
        level1Button.setScale(5);
        level1Button.on('pointerover', () => {
            level1Button.setAlpha(0.5);  
        });
        level1Button.on('pointerout', () => {
            level1Button.setAlpha(1);
        });
        level1Button.on('pointerdown', () => {
            this.scene.start('level1');
        });

        this.add.text(720, 400, "Level 2", {
            fontSize: "36px",
            fontFamily: "'Chewy'",
            color: "#f2ecb1",
        }).setScrollFactor(0).setOrigin(0.5);

        let level2Button = this.add.sprite(720, 500, 'barrel');
        level2Button.setInteractive();
        level2Button.setScrollFactor(0);
        level2Button.setScale(5);
        level2Button.on('pointerover', () => {
            level2Button.setAlpha(0.5);  
        });
        
        level2Button.on('pointerout', () => {
            level2Button.setAlpha(1);
        });
        level2Button.on('pointerdown', () => {
            this.scene.start('level2');
        });

        this.add.text(1080, 400, "Level 3", {
            fontSize: "36px",
            fontFamily: "'Chewy'",
            color: "#f2ecb1",
        }).setScrollFactor(0).setOrigin(0.5);

        let level3Button = this.add.sprite(1080, 500, 'pumpkin');
        level3Button.setInteractive();
        level3Button.setScrollFactor(0);
        level3Button.setScale(5);
        level3Button.on('pointerover', () => {
            level3Button.setAlpha(0.5);  
        });
        
        level3Button.on('pointerout', () => {
            level3Button.setAlpha(1);
        });
        level3Button.on('pointerdown', () => {
            this.scene.start('level3_1');
        });
    }


}
