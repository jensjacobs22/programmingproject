

let config =
{
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'snakeGame',
    physics: 
    {
        default: 'arcade',
        arcade:
        {
            debug: false
        }
    },
    scene:
    {
        preload: preload,
        create: create,
        update: update
    }
};

let snake;
let tail;
let mouse;
let score = 0;
let gameOver = false;
let scoreText;

// deze nog te evalueren
let snakeWidth = 32;
let canRight = true;
let canLeft = true;
let canUp = true;
let canDown = true;

let game = new Phaser.Game(config);

function preload()
{
    this.load.spritesheet('snake', '../assets/snake/snake.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('mouse', '../assets/snake/star.png');
    this.load.image('background', '../assets/snake/blackbackground(1).png');
}

function create()
{

    this.add.image(400, 300, 'background');

    // Creër het object, attributen en methoden die met de slang te maken hebben.
    snake = this.physics.add.sprite(200, 300, 'snake'); //Maak het snake object aan
    snake.setCollideWorldBounds(true); //Zorg dat de slang niet buiten de schermranden kan gaan
    this.anims.create(
        {
            key: 'left',
            frames: this.anims.generateFrameNumbers('snake', {start: 9, end: 11}),
            frameRate: 5,
            repeat: -1
        });

    this.anims.create(
        {
            key: 'up',
            frames: this.anims.generateFrameNumbers('snake', {start: 0, end: 2}),
            frameRate: 5,
            repeat:-1
        });
    
    this.anims.create(
        {
            key: 'down',
            frames: this.anims.generateFrameNumbers('snake', {start: 6, end: 8}),
            frameRate: 5,
            repeat: -1
        });
    
    this.anims.create(
        {
            key: 'right',
            frames: this.anims.generateFrameNumbers('snake', { start: 3, end: 5 }),
            frameRate: 5,
            repeat: -1
        });
    
    // check of de slang met zichzelf botst, indien dit gebeurd roep de eatSelf functie aan
    this.physics.add.collider(snake, tail, eatSelf, null, this);

    mouse = this.physics.add.group(
        {
            key: 'mouse',
            repeat: 1,
            setXY: { x: 12, y: 0, stepX: 50}
        }
    );
    
    // creër key objecten waarmee we de slang kunnen bewegen en geef er methoden aan mee
    cursors = this.input.keyboard.createCursorKeys();

    // Scorebord

    scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '30px', fill: '#FFF'});

    this.physics.add.overlap(snake, mouse, eatMouse, null, this);
}

function update ()
{
    if (gameOver)
    {
        return;
    }

    if (canLeft && cursors.left.isDown)
    {
        canRight = false;
        canLeft = true;
        canUp = true;
        canDown = true;
        snake.setVelocityX(-160);
        snake.setVelocityY(0);
        if(tail)
        {
        tail.setVelocityX(-160);
        tail.setVelocityY(0);
        };

        snake.anims.play('left', true);
    }
    else if (canRight && cursors.right.isDown)
    {
        canRight = true;
        canLeft = false;
        canUp = true;
        canDown = true;
        snake.setVelocityX(160);
        snake.setVelocityY(0);
        if (tail)
        {
        tail.setVelocityX(160);
        tail.setVelocityY(0);
        };

        snake.anims.play('right', true);
    }
    else if (canUp && cursors.up.isDown)
    {
        canRight = true;
        canLeft = true;
        canUp = true;
        canDown = false;
        snake.setVelocityY(-160);
        snake.setVelocityX(0);
        if(tail)
        {
        tail.setVelocityX(0);
        tail.setVelocityY(-160);
        };

        snake.anims.play('up', true);
    }

    else if (canDown && cursors.down.isDown)
    {
        canRight = true;
        canLeft = true;
        canUp = false;
        canDown = true;
        snake.setVelocityY(160);
        snake.setVelocityX(0);
        if (tail)
        {
        tail.setVelocityX(0);
        tail.setVelocityY(160);
        };
        
        snake.anims.play('down', true);
    }
}

function eatSelf (snake, mouse)
    {
        this.physics.pause();
    
        snake.setTint(0xff0000);
    
        snake.anims.play('turn');
    
        gameOver = true;
    }

function setTailbounds()
{
    tail.setCollideWorldBounds(true);
}

function eatMouse(snake, mouse)
{
    mouse.disableBody(true, true);
    
    tail = this.physics.add.sprite(snake.x, snake.y, 'snake');
    tail.setFrame(snake.frame);
    console.log(snake.frame);

    setTailbounds();

    score += 1;
    scoreText.setText('score: ' + score);
}