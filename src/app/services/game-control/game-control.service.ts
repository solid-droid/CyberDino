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
  this.game.loadSprite("ground", './assets/sprites/ground.png');
  this.game.loadSprite("block", './assets/sprites/block.png');
  }
  

  createPlayer(playerPos:any){
    this.player = this.game.add(
      [
      this.game.sprite('CyberDinoRunRight'),
      this.game.pos(playerPos),
      this.game.origin('bot'),
      this.game.area({ width: 40, height: 45}),
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
          this.cleanupLeft(nextX-2400);
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
            this.player.use(this.game.area({ width: 40, height: 45}));
            this.player.play("runRight");
        } else if (!this.player.isGrounded() && this.player.curAnim() !== "idleRight") {
            this.player.use(this.game.sprite('CyberDinoRunRight'));
            this.player.use(this.game.area({ width: 40, height: 45}));
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
            this.player.use(this.game.area({ width: 40, height: 45}));
            this.player.play("runLeft")
          } else if (!this.player.isGrounded() && this.player.curAnim() !== "idleLeft") {
            this.player.use(this.game.sprite('CyberDinoRunLeft'));
            this.player.use(this.game.area({ width: 40, height: 45}));
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
        this.player.use(this.game.area({ width: 40, height: 45}));
      }

    });
    this.player.onGround(() => {
      if (!this.game.isKeyDown("left") && !this.game.isKeyDown("right")) {
        this.player.use(this.game.sprite('CyberDinoRunRight'));
        this.player.use(this.game.area({ width: 40, height: 45}));
        this.player.play("idleRight");
      } 

    this.game.onKeyRelease(["left", "right", "down"], () => {
        if (this.player.isGrounded() && !this.game.isKeyDown("left") && !this.game.isKeyDown("right")) {
          this.player.use(this.game.sprite('CyberDinoRunRight'));
          this.player.use(this.game.area({ width: 40, height: 45}));
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

  enableCollisions(levelId:any){
   
    this.player.onCollide("coin", (coin:any) => {
      coin.destroy();
    });

    this.player.onCollide("enemy", async (enemy:any, collision:any) => {
      this.isJumping = false;
      enemy.destroy();
      if(!collision.isBottom()){
        this.player.color = this.game.rgb(255, 0, 0 );
        this.game.shake(10);
        await this.delay(1000);
        this.player.color = this.game.rgb();
      } else {
   
      }

      
    });

    this.player.onCollide("next", () => {
      // this.game.go("game", {
      //   levelId: levelId < Object.values(this.levels) ? levelId + 1 : 0,
      //   player: this.game.vec2(this.game.width()/2,this.player.pos.y),
      // });   
    });
  }

  delay = async (wait = 1000) => await new Promise(r => setTimeout(r , wait));

  createScene(){
    this.game.scene("game", ({ levelId, player } = { levelId: 0 , player: this.game.vec2(this.playerMaxPos , 300) }) => {

        this.createGround();
        this.createBlocks();
        this.createCoins();
        this.createEnemies();


        this.createPlayer(player);
        this.arowControl();
        this.enableCollisions(levelId);
        this.startAnimations(); 
    });

    

    this.game.go("game");
 
  }

  cleanupLeft(x:any){

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
  createEnemies(x = 0){

  };


  enableDebug(status = true){
    this.game.debug.inspect = status;
  }
}
