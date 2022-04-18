import { Injectable } from '@angular/core';
declare const kaboom:any;
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class GameControlService {

  game:any;
  player:any;
  SPEED = 500;
  isJumping = false;
  nextGround:any;
  playerMaxPos = 200;
  coins = 0;
  coinsLabel:any;
  chestCount = 0;
  chestCapacity = 1;
  chestBuffer:any = [];


  constructor() { 

  }


  beginGame(){
    this.game = kaboom({ 
      global: false,
      font: "sinko",
      canvas: document.querySelector("#gameCanvas"),
      background: [ 240,240,240 ],
   });

   $(window).on('resize',() => {
    this.resize();
    });


  }

  resize(){
    this.player.use(this.game.pos(0, this.game.height()-200));
  }

  loadSprites(){
    this.game.loadSprite("CyberDinoRunRight", './assets/sprites/dino.png', {
      sliceX: 5,
      sliceY:1,
      anims: {
          runRight: {
            from:2,
            to: 3,
            speed: 15,
            loop: true,
          },
          idleRight: 0,
      },
  });

  this.game.loadSprite("CyberDinoRunLeft", './assets/sprites/dinoLeft.png', {
    sliceX: 5,
    sliceY:1,
    anims: {
      runLeft: {
          from:2,
          to: 1,
          speed: 15,
          loop: true,
        },
      idleLeft: 4,
    },
});

this.game.loadSprite("CyberDinoCrouchRight", './assets/sprites/dinoCrouch.png', {
  sliceX: 2,
  sliceY:1,
  anims: {
    crouchRight: {
        from:0,
        to: 1,
        speed: 15,
        loop: true,
      },
    crouchIdleRight: 0,
  },
});

this.game.loadSprite("CyberDinoCrouchLeft", './assets/sprites/dinoCrouchLeft.png', {
  sliceX: 2,
  sliceY:1,
  anims: {
    crouchLeft: {
        from:1,
        to: 0,
        speed: 15,
        loop: true,
      },
    crouchIdleLeft: 1,
  },
});


  this.game.loadSprite("coin",'./assets/sprites/coin.png',{
    sliceX: 6,
    anims:{
      spin: {
        from:0,
        to: 5,
        speed: 10,
        loop: true,
      },
    }
  });

  this.game.loadSprite("chest",'./assets/sprites/chest.png',{
    sliceX: 7,
    anims:{
      explode: {
        from:0,
        to: 6,
        speed: 10,
      },
      closed: 0,
      open: {
        from:0,
        to:3,
        speed:10
      }
    }
  });

  this.game.loadSprite("enemy",'./assets/sprites/Enemy.png',{
    sliceX: 2,
    sliceY:1,
    anims: {
      run: {
        from:0,
        to: 1,
        speed: 10,
        loop: true,
      },
    }
  });

  this.game.loadSprite("bird",'./assets/sprites/bird.png',{
    sliceX: 2,
    sliceY:1,
    anims: {
      fly: {
        from:0,
        to: 1,
        speed: 10,
        loop: true,
      },
    }
  });
  this.game.loadSprite("ground", './assets/sprites/ground.png');
  this.game.loadSprite("cloud", './assets/sprites/cloud.png');
  this.game.loadSprite("block", './assets/sprites/block.png');
  }
  

  createPlayer(playerPos:any){
    this.player = this.game.add(
      [
      this.game.sprite('CyberDinoRunRight'),
      this.game.pos(playerPos),
      this.game.origin('bot'),
      this.game.area({ width: 40, height: 43}),
      this.game.health(8),
      this.game.scale(2),
      this.game.body(),
      "player",
  ]);
    this.nextGround = 1000;
    this.player.onUpdate(() => {

        this.game.camPos(this.game.vec2(this.player.pos.x+this.game.width()/3, (this.player.pos.y * 0.1) + 255));
        if(this.player.isGrounded()){
          this.isJumping = false;
        }

        if(this.player.pos.y > 900){
          this.game.go("game");
        }

        if(this.player.pos.x > this.nextGround ){
          this.nextGround += 2400;
          const nextX = this.nextGround - 1000;
          this.createGround(nextX);
          this.createBlocks(nextX);
          this.createCoins(nextX);
          this.createEnemies(nextX);
          this.createBirds(nextX);
        }

    });
  }
  arowControl(){
    //Rigth////////////////////////////////////////////  
    this.game.onKeyDown("right", () => {
      this.player.move(this.SPEED, 0)
      this.playerMaxPos = this.player.pos.x;
      if(!this.game.isKeyDown("down")){
        if (this.player.isGrounded() && this.player.curAnim() !== "runRight") {
            this.player.use(this.game.sprite('CyberDinoRunRight'));
            this.player.use(this.game.area({ width: 40, height: 43}));
            this.player.play("runRight");
        } else if (!this.player.isGrounded() && this.player.curAnim() !== "idleRight") {
            this.player.use(this.game.sprite('CyberDinoRunRight'));
            this.player.use(this.game.area({ width: 40, height: 43}));
            this.player.play("idleRight");
        }
      }
      else {
        if(this.player.isGrounded() && this.player.curAnim() !== "crouchRight") {
          this.player.use(this.game.sprite('CyberDinoCrouchRight'));
          this.player.use(this.game.area({ width: 47, height: 25}));
          this.player.play("crouchRight");
        } else if (!this.player.isGrounded() && this.player.curAnim() !== "crouchRightIdle") {
          this.player.use(this.game.sprite('CyberDinoCrouchRight'));
          this.player.use(this.game.area({ width: 47, height: 25}));
          this.player.play("crouchIdleRight");
        }
      }
    });
  
    //Left////////////////////////////////////////////
  this.game.onKeyDown("left", () => {
    const threshold = this.playerMaxPos - 1000 < 100 ? 100 : this.playerMaxPos - 1000;
    if(this.player.pos.x > threshold){
       this.player.move(-this.SPEED, 0);
       if(!this.game.isKeyDown("down")){
          if (this.player.isGrounded() && this.player.curAnim() !== "runLeft") {
            this.player.use(this.game.sprite('CyberDinoRunLeft'));
            this.player.use(this.game.area({ width: 40, height: 43}));
            this.player.play("runLeft")
          } else if (!this.player.isGrounded() && this.player.curAnim() !== "idleLeft") {
            this.player.use(this.game.sprite('CyberDinoRunLeft'));
            this.player.use(this.game.area({ width: 40, height: 43}));
            this.player.play("idleLeft");
          }
      } else {
        if(this.player.isGrounded() && this.player.curAnim() !== "crouchLeft") {
          this.player.use(this.game.sprite('CyberDinoCrouchLeft'));
          this.player.use(this.game.area({ width: 47, height: 25}));
          this.player.play("crouchLeft");
        } else if (!this.player.isGrounded() && this.player.curAnim() !== "crouchLeftIdle") {
          this.player.use(this.game.sprite('CyberDinoCrouchLeft'));
          this.player.use(this.game.area({ width: 47, height: 25}));
          this.player.play("crouchIdleLeft");
        }
      }
    }
   });

//Down////////////////////////////////////////////
this.game.onKeyDown("down", () => {
  if (!this.game.isKeyDown("left") && !this.game.isKeyDown("right") && this.player.curAnim() !== "crouchIdleRight") {
    this.player.use(this.game.sprite('CyberDinoCrouchRight'));
    this.player.use(this.game.area({ width: 47, height: 25}));
    this.player.play("crouchIdleRight");
  }


});

   //UP _ SPACE //////////////////////////////////////////////////
    this.game.onKeyPress(["up","space"], () => {
      if (!this.isJumping) {
        this.isJumping = true;
        this.player.jump(900);
        this.player.use(this.game.sprite('CyberDinoRunRight'));
        this.player.use(this.game.area({ width: 40, height: 43}));
      }

    });
    this.player.onGround(() => {
      if (!this.game.isKeyDown("left") && !this.game.isKeyDown("right")) {
        this.player.use(this.game.sprite('CyberDinoRunRight'));
        this.player.use(this.game.area({ width: 40, height: 43}));
        this.player.play("idleRight");
      } 

    this.game.onKeyRelease(["left", "right", "down"], () => {
        if (this.player.isGrounded() && !this.game.isKeyDown("left") && !this.game.isKeyDown("right")) {
          this.player.use(this.game.sprite('CyberDinoRunRight'));
          this.player.use(this.game.area({ width: 40, height: 43}));
          this.player.play("idleRight")
        }
      })
     
    });
  }

  async startAnimations(){
    await this.delay(1000);
    this.game.every('coin', (coin:any) => {
      coin.play('spin');
    });
  }

  enableCollisions(){
   
    this.player.onCollide("coin", (coin:any) => {
      coin.destroy();
      this.coins++;
      this.coinsLabel.text = this.coins;
      if(this.coins > this.chestCapacity && this.chestCount < 4){
        this.coins = 0;
        this.createChest();
      }
    });

    this.player.onCollide('evil', async (enemy:any, collision:any) => {
      this.isJumping = false;
      enemy.destroy();
      console.log(collision.isBottom(), collision.isTop(), collision.isLeft(), collision.isRight());
      if(!collision.isBottom()){
        this.player.color = this.game.rgb(255, 0, 0 );
        this.game.shake(10);
        await this.delay(1000);
        this.player.color = this.game.rgb();
      } else {
   
      }

      
    });

  }

  delay = async (wait = 1000) => await new Promise(r => setTimeout(r , wait));

  createScene(){
    this.game.scene("game", ({ levelId, player } = { levelId: 0 , player: this.game.vec2(this.playerMaxPos , 300) }) => {

        this.createGround();
        this.createBlocks();
        this.createCoins();


        this.createPlayer(player);
        this.createEnemies();
        this.createBirds();

        this.game.onUpdate('enemy' , (d:any)=> {
          d.move(- Math.max(30,(d._id%10) * 20) ,0)
        });

        this.game.onUpdate('bird' , (d:any)=> {
          d.move(- Math.max(30,(d._id%10) * 20) ,0)
        });
 
        this.arowControl();
        this.createLabel();

        this.enableCollisions();
        this.startAnimations(); 
    });

    

    this.game.go("game");
 
  }


  createLabel(){
    this.coinsLabel = this.game.add([
      this.game.text(this.coins),
      this.game.pos(24, 24),
      this.game.scale(4),
      this.game.fixed(),
    ])
  }

  
  createChest(){
    const chest = this.game.add([
      this.game.sprite('chest'),
      this.game.pos(this.game.width() -100 - this.chestCount*100  , 10),
      this.game.scale(1.5),
      this.game.fixed(),
    ]);
    const label = this.game.add([
      this.game.text(`x${this.chestCapacity}`),
      this.game.pos(this.game.width() -100 - this.chestCount*100  , 70),
      this.game.scale(2),
      this.game.fixed(),
    ])
    this.chestBuffer.push({chest,label});
    this.chestCount++;
  }

  createClouds(x=0){
    const heightRange = [460 , 600];
    const count =  Math.random() * 5;
    let nextX = x;
    for(let i = 0; i < count; i++){
      nextX = nextX + 100 + Math.random() * 1500;
      const nextY = heightRange[Math.floor(Math.random()*heightRange.length)];
      const cloud = this.game.add(
        [
          this.game.sprite('cloud'),
          this.game.pos(nextX, this.game.height() - nextY),
          this.game.origin('center'),
          this.game.area({ width: 30, height: 20 }),
          this.game.scale(1.7),
          this.game.outview({offset: 1000}),
           'cloud',
        ]
      );
      cloud.onExitView( () => {
      if(cloud.pos.x < this.playerMaxPos)
      cloud.destroy();
      });

    }
  }

  createGround(x=0){
    const ground = this.game.add(
      [
        this.game.sprite('ground'),
        this.game.pos(x, this.game.height() - 200),
        this.game.scale(2),
        this.game.origin('botleft'),
        this.game.area({ width: 1200, height: 42 }),
        this.game.solid(),
        this.game.outview({offset: 1300}),
        'ground'
      ]
    );

    ground.onExitView( () => {
      if(ground.pos.x < this.playerMaxPos - 1200)
      ground.destroy();
      });
  }

  createBlocks(x=0){
    const heightRange = [400 , 500];
    const count =  Math.random() * 10;
    let nextX = x;
    for(let i = 0; i < count; i++){
      nextX = nextX + 70 + Math.random() * 1000;
      const nextY = heightRange[Math.floor(Math.random()*heightRange.length)];
      const block = this.game.add(
        [
          this.game.sprite('block'),
          this.game.pos(nextX, this.game.height() - nextY),
          this.game.scale(2),
          this.game.origin('botleft'),
          this.game.area({ width: 61, height: 10 }),
          this.game.solid(),
          this.game.outview({offset: 1000}),
          'ground'
        ]
      );
      block.onExitView( () => {
        if(block.pos.x < this.playerMaxPos)
          block.destroy();
        });
    }
  };
  createCoins(x =0 ){
    const heightRange = [350 , 450 , 550];
    const count =  Math.random() * 10;
    let nextX = x;
    for(let i = 0; i < count; i++){
      nextX = nextX + 100 + Math.random() * 1000;
      const nextY = heightRange[Math.floor(Math.random()*heightRange.length)];
      const coin = this.game.add(
        [
          this.game.sprite('coin'),
          this.game.pos(nextX, this.game.height() - nextY),
          this.game.scale(0.3),
          this.game.origin('center'),
          this.game.area({ width: 100, height: 100 }),
          this.game.outview({offset: 1000}),
          'coin'
        ]
      );
      coin.onExitView( () => {
      if(coin.pos.x < this.playerMaxPos)
        coin.destroy();
      });

      coin.play('spin');
    }
  };
  createBirds(x = 0){
    const heightRange = [460 , 600];
    const count =  Math.random() * 5;
    let nextX = x;
    for(let i = 0; i < count; i++){
      nextX = nextX + 100 + Math.random() * 1500;
      const nextY = heightRange[Math.floor(Math.random()*heightRange.length)];
      const bird = this.game.add(
        [
          this.game.sprite('bird'),
          this.game.pos(nextX, this.game.height() - nextY),
          this.game.origin('center'),
          this.game.area({ width: 30, height: 20 }),
          this.game.scale(1.7),
          this.game.outview({offset: 1000}),
          this.game.solid(),
           'bird',
           'evil'
        ]
      );
      bird.onExitView( () => {
      if(bird.pos.x < this.playerMaxPos)
      bird.destroy();
      });

      bird.play('fly');
    }
  }
  createEnemies(x = 0){
    const heightRange = [350];
    const count =  Math.random() * 5;
    let nextX = x;
    for(let i = 0; i < count; i++){
      nextX = nextX + 100 + Math.random() * 1500;
      const nextY = heightRange[0];
      const enemy = this.game.add(
        [
          this.game.sprite('enemy'),
          this.game.pos(nextX, this.game.height() - nextY),
          this.game.origin('center'),
          this.game.area({ width: 15, height: 15 }),
          this.game.scale(2.5),
          this.game.outview({offset: 1000}),
          this.game.body(),
          'enemy',
          'evil'
        ]
      );
      enemy.onExitView( () => {
      if(enemy.pos.x < this.playerMaxPos)
      enemy.destroy();
      });

      enemy.play('run');
    }
  };


  enableDebug(status = true){
    this.game.debug.inspect = status;
  }
}
