import { Injectable } from '@angular/core';
declare const kaboom:any;
import * as $ from 'jquery';
import { GameLevelsService } from '../game-levels/game-levels.service';

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
  score:any;
  coinsLabel:any;
  winOnce = false;
  totalCoinCounter = 0;
  
  chestCapacity = 20;
  chestBuffer:any = [];
  functionQueue:any = [];
  lastChestType = 'destroy';
  destroyInProgress = false;

  saveEvent = false;
  saveClicked = false;
  showMessage:any = null;
  closeMessage:any = null;
  messageCounter = 0;
  currentMessage = 0;
  evilMode = false;
  evilTune:any;

  height:any;
  gameOver = false;
  gameOverDelay = false;
  backgroundAudio:any;
  enableHack = false;
  hackLabel :any;
  card:any;

  constructor(
    private readonly gameLevels: GameLevelsService
  ){}

  beginGame(){
    this.game = kaboom({ 
      global: false,
      font: "sinko",
      canvas: document.querySelector("#gameCanvas"),
      background: [ 240,240,240 ],
   });
   if(this.gameLevels.displayCounter.intro === 0){
    this.showMessage(this.gameLevels.intro());
   }

   this.functionLoop();

   if(window.devicePixelRatio > 1.5){
     if(screen.orientation.type.includes('landscape')){
      this.height = window.innerHeight+150;
     } else if(screen.orientation.type.includes('portrait')){
      this.height = window.innerHeight*0.8;
     }
  } 

   if(window.devicePixelRatio > 2){
    if(screen.orientation.type.includes('landscape')){
      this.height = window.innerHeight-100;
     }

   }

   
   if(window.devicePixelRatio < 1.5){
    this.height = window.innerHeight * 0.8 * window.devicePixelRatio - 100;
    this.height = this.height < 600 ? 646 : this.height;
   }

   $(window).on('resize',() => {
    this.resize();
    });


  }

  resize(){
    this.player.use(this.game.pos(0, this.height -200));
  }

  async functionLoop(){
    while(true){
      await new Promise(r => setTimeout(r, 500));
      const createList = this.functionQueue.filter((x:any) => x.name === 'create');
      const destroyList = this.functionQueue.filter((x:any) => x.name === 'destroy');
      if(this.functionQueue.length){
        if(this.lastChestType === 'destroy' && createList.length){
          this.lastChestType = 'create';
          await createList.shift().func(this);
          const index = this.functionQueue.findIndex((x:any) => x.name === 'create');
          this.functionQueue.splice(index, 1);
        } else if(this.lastChestType === 'create' && destroyList.length){
          this.lastChestType = 'destroy';
          const force = destroyList[0].force;
          await destroyList.shift().func(this , force);
          const index = this.functionQueue.findIndex((x:any) => x.name === 'destroy');
          this.functionQueue.splice(index, 1);
        } else {
          this.functionQueue.shift().func(this);
        }
      }
    }
  }

  loadSound(){
    this.game.loadSound("background", "./assets/sound/Trippy_Trip_Trop.mp3");
    this.game.loadSound("jump", "./assets/sound/jump.mp3");
    this.game.loadSound("coin", "./assets/sound/coin.mp3");
    this.game.loadSound("damage", "./assets/sound/damage.mp3");
    this.game.loadSound("blast", "./assets/sound/blast.mp3");
    this.game.loadSound("gameover", "./assets/sound/gameover.mp3");
    this.game.loadSound("trippyEvil", "./assets/sound/evil.mp3");
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
          trippyRun:{
            from:0,
            to:4,
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

  this.game.loadSprite("blinkingCoin",'./assets/sprites/blinkingCoin.png',{
    sliceX: 12,
    anims:{
      spin: {
        from:0,
        to: 11,
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
      },
      hacking: {
        from:0,
        to:1,
        speed:4,
        loop: true,
      }
    }
  });

  this.game.loadSprite("key",'./assets/sprites/key2.png',{
    sliceX: 10,
    anims:{
      bounce: {
        from:0,
        to: 9,
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

  this.game.loadSprite("scrollKey",'./assets/sprites/scrollKey.png',{
    sliceX: 5,
    anims: {
      move: {
        from:0,
        to: 4,
        speed: 10,
        loop: true,
      },
    }
  });

  this.game.loadSprite("redBird",'./assets/sprites/redBird.png',{
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
  
  evilCoinConfig = () => [
    this.game.sprite('coin'),
    this.game.area({ width: 70, height: 70}),
    this.game.scale(0.3)
  ];

  birdConfig = () => [
    this.game.sprite('bird'),
    this.game.area({ width: 30, height: 20 }),
    this.game.scale(1.7),
  ];

  enemyConfig = () => [
    this.game.sprite('enemy'),
    this.game.area({ width: 15, height: 15 }),
    this.game.scale(2.5),
  ];

  createPlayer(playerPos:any){
    this.player = this.game.add(
      [
      this.game.sprite('CyberDinoRunRight'),
      this.game.pos(playerPos),
      this.game.origin('bot'),
      this.game.area({ width: 40, height: 43}),
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
          this.createRedBirds(nextX);
          this.createScrollKey(nextX);
          this.createBombCoin(nextX);
        }

    });
  }
  arowControl(){
    this.game.onKeyPress(() => {
      if(this.gameOver && this.gameOverDelay){
        this.game.go("game");
      }

      if(!this.backgroundAudio){
        this.backgroundAudio = this.game.play("background", {
          volume: 0.8,
          loop: true
      });
      }
  })

    //Rigth////////////////////////////////////////////  
    this.game.onKeyDown("right", () => {
      if(!this.gameOver){
        this.player.move(this.SPEED, 0)
        this.playerMaxPos = this.player.pos.x;
        this.score.text = parseInt(String((this.playerMaxPos - 200)/100));
        let runAnim = this.evilMode ? "trippyRun" : "runRight";
        if(!this.game.isKeyDown("down")){
          if (this.player.isGrounded() && this.player.curAnim() !== runAnim) {
              this.player.use(this.game.sprite('CyberDinoRunRight'));
              this.player.use(this.game.area({ width: 40, height: 43}));
              this.player.play(runAnim);
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
      }
      
    });
  
    //Left////////////////////////////////////////////
  this.game.onKeyDown("left", () => {
    if(!this.gameOver){
      const threshold = this.playerMaxPos - 500 < 100 ? 100 : this.playerMaxPos - 500;
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
    }
   });

//Down////////////////////////////////////////////
this.game.onKeyDown("down", () => {
  if(!this.gameOver){
    if (!this.game.isKeyDown("left") && !this.game.isKeyDown("right") && this.player.curAnim() !== "crouchIdleRight") {
      this.player.use(this.game.sprite('CyberDinoCrouchRight'));
      this.player.use(this.game.area({ width: 47, height: 25}));
      this.player.play("crouchIdleRight");
    }
  }

});

   //UP _ SPACE //////////////////////////////////////////////////
    this.game.onKeyPress(["up","space"], () => {
      if(!this.gameOver){
        if (!this.isJumping) {
          this.isJumping = true;
          this.game.play('jump');
          this.player.jump(900);
          this.player.use(this.game.sprite('CyberDinoRunRight'));
          this.player.use(this.game.area({ width: 40, height: 43}));
        }
      }

    });
    this.player.onGround(() => {
      if(!this.gameOver){
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
      }
     
    });
  }

  async startAnimations(){
    await this.delay(1000);
    this.game.every('coin', (coin:any) => {
      coin.play('spin');
    });
  }

  enableCollisions(){
   
    this.player.onCollide("blinkingCoin", (coin:any) => {
      coin.destroy();
      if(this.gameLevels.displayCounter.bomb === 0){
        this.showMessage(this.gameLevels.bomb());
      }
      this.destroychest(this, true);
    });

    this.player.onCollide("coin", (coin:any) => {
      coin.destroy();
      this.addCoins(1);
    });


    this.player.onCollide("scrollKey", async (scroll:any) => {
      scroll.destroy();
      let counter = 0;
      if(this.gameLevels.displayCounter.phising < 2){
        this.showMessage(this.gameLevels.phising());
        const msgCount = this.messageCounter;
        this.saveEvent = true;
        while(this.saveEvent){
          await this.delay(100);
          if(msgCount <= this.currentMessage){
            if(counter++ > 50){
              this.saveEvent = false;
            }
          }
        }
      } else {
        counter = 51;
      }
      if(!this.evilMode && (counter > 50 || this.saveClicked)){
        this.saveClicked = false;
        this.backgroundAudio?.pause();
        this.evilTune = this.game.play('trippyEvil');
        this.evilMode = true;
        this.game.get("evil").forEach(async (item:any) => {
          item.use(this.game.sprite('coin'));
          item.use(this.game.area({ width: 70, height: 70}));
          item.use(this.game.scale(0.3));
          item.play('spin');
        });
        this.game.wait(this.evilTune?.duration()-0.5).then(() => {
          if(this.evilMode){
            this.backgroundAudio?.play();
            this.evilMode = false;
            if(this.gameLevels.displayCounter.phisingBlocked < 2){
              this.showMessage(this.gameLevels.phisingBlocked());
            }
            this.game.get("enemy").forEach((item:any) => {
              item.use(this.game.sprite('enemy'));
              item.use(this.game.area({ width: 15, height: 15 }));
              item.use(this.game.scale(2.5));
              item.play('run');
            });
            this.game.get("bird").forEach((item:any) => {
              item.use(this.game.sprite('bird'));
              item.use(this.game.area({ width: 30, height: 20 }));
              item.use(this.game.scale(1.7));
              item.play('fly');
            });

          }
        });
      }

    });



    this.player.onCollide('redBird', async (enemy:any, collision:any) => {
      if(collision.isBottom()){ 
        this.stopHacking();
      }

    });
    this.player.onCollide('evil', async (enemy:any, collision:any) => {
      this.isJumping = false;
      enemy.destroy();
      if(!collision.isBottom()){  
        this.pushPlayerBack();
        this.game.play('damage');
        this.player.color = this.game.rgb(255, 0, 0 );
        this.game.shake(10);
        if(this.coins!==0){
          this.removeCoinAnimation(this.coins);
          this.coins = 0;
          this.coinsLabel.text = this.coins;
          await this.delay(1000);
          this.player.color = this.game.rgb();
        } else {
          if(this.chestBuffer.length){
            this.destroychest(this, true);
            await this.delay(1000);
            this.player.color = this.game.rgb();
          } else {
            this.gameOverDelay = true;
            this.gameOver = true;
            this.evilMode = false;
            this.evilTune?.stop();
            this.gameOverAnimations();
            await this.delay(1000);
            this.gameOverDelay = false;
            await this.delay(1000);
            if(this.gameOver){
              this.game.go("game");
            }
          }

        }

      } else {
        //enemy kill points
   
      }

      
    });

  }

  addCoins(coinCount:number){
    if(coinCount>0){
      this.addCoinAnimation(coinCount);
    } else {
      this.removeCoinAnimation(-coinCount);
    }
    this.coins+=coinCount;
    this.game.play('coin');
    this.coinsLabel.text = this.coins;
    if(this.coins === this.chestCapacity && this.chestBuffer.length < 4){
      this.coins = 0;
      this.coinsLabel.text = this.coins;
      this.functionQueue.push({name: 'create' , func:this.createChest});
    }
  }

  async pushPlayerBack(){
    for(let i =0;i<20;++i){
      this.player.move(-1000, 0);
      await this.delay(3);
    }
  }

  gameOverAnimations(){
    this.closeMessage();
    this.backgroundAudio?.stop();
    this.game.play("gameover");
   this.game.add([
      this.game.text(`[Game Over].black`,{font: "sink", 
      styles:{
        black:{
          color: this.game.rgb(0, 0, 0),
        }
      }
    }),
      this.game.pos(this.game.width()/2  , this.game.height()/4),
      this.game.origin('center'),
      this.game.scale(10),
      this.game.fixed(),
    ]);

    this.game.add([
      this.game.text(`[Your Score: ${parseInt(String((this.playerMaxPos - 200)/100))}].black`,{font: "sink", 
      styles:{
        black:{
          color: this.game.rgb(0, 0, 0),
        }
      }
    }),
      this.game.pos(this.game.width()/2  , this.game.height()/4 + 100),
      this.game.origin('center'),
      this.game.scale(3),
      this.game.fixed(),
    ]);

  }

  delay = async (wait = 1000) => await this.game.wait(wait/1000);

  createScene(){
    this.game.scene("game", ({ levelId, player } = { levelId: 0 , player: this.game.vec2(200 , 300) }) => {
        
        this.gameOver = false;
        this.playerMaxPos = 200;
        this.lastChestType = 'destroy';
        this.coins = 0;
        this.chestBuffer = [];
        this.enableHack = false;
        this.evilMode = false;
        this.winOnce = false;

        this.evilTune?.stop();
        this.gameLevels.displayCounter.phisingBlocked = 0;
        this.gameLevels.displayCounter.phising = 0;
        this.gameLevels.displayCounter.bomb = 0;
        this.gameLevels.displayCounter.hacking = 0;
        this.gameLevels.displayCounter.hackingStoped = 0;

        this.createGround();
        this.createBlocks();
        this.createCoins();

        this.backgroundAudio?.play();

        this.createPlayer(player);
        // this.createEnemies();
        // this.createBirds();

        this.game.onUpdate('evil' , (d:any)=> {
          if(!this.gameOver)d.move(- Math.max(30,(d._id%10) * 20) ,0);

        });

        this.game.loop(3, () => {
          this.game.get("destroyItems").forEach((d:any) => (d.pos.x < this.playerMaxPos - 600) ? d.destroy() : null);
          this.game.get("mainGround").forEach((d:any) => (d.pos.x < this.playerMaxPos - 5000) ? d.destroy() : null);
        });
        this.arowControl();
        this.createLabel();

        this.enableCollisions();
        this.startAnimations(); 
    });

    

    this.game.go("game");
 
  }


  debounce(cb:any, delay = 1000) {
    let timeout:any;
  
    return (...args:any) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        cb(...args)
      }, delay)
    }
  }

  throttle(cb:any, delay = 1000) {
    let shouldWait = false
    let waitingArgs:any;
    const timeoutFunc = () => {
      if (waitingArgs == null) {
        shouldWait = false
      } else {
        cb(...waitingArgs)
        waitingArgs = null
        setTimeout(timeoutFunc, delay)
      }
    }
  
    return (...args:any) => {
      if (shouldWait) {
        waitingArgs = args
        return
      }
  
      cb(...args)
      shouldWait = true
  
      setTimeout(timeoutFunc, delay)
    }
  }


  getLabel(text:string, x:number, y:number){

    return this.game.add([
      this.game.text(`[${text}].black`,{
      font: "sink", 
      size: 24,
      styles:{
        black:{
          color: this.game.rgb(0, 0, 0),
        }
      }}),
      this.game.pos(x, y),
      this.game.scale(1),
      this.game.fixed(),
    ])
  }

  createLabel(){
    this.coinsLabel = this.game.add([
      this.game.text(this.coins),
      this.game.pos(24, 24),
      this.game.scale(4),
      this.game.fixed(),
    ]);
    this.score = this.game.add([
      this.game.text('0'),
      this.game.pos(24, this.game.height()-20),
      this.game.scale(2),
      this.game.fixed(),
    ]);
  }

 addCoinAnimation =  this.throttle(async (coin:number)=>{
  const id = 'add'+this.totalCoinCounter++;
  $('#gameContainer').append(`<div id=${id} class="addCoins">+ ${coin} coins</div>`);
  $("#"+id).animate({top: '-=50px'}).fadeOut(500, () => $("#"+id).remove());
  if(this.totalCoinCounter>100){
    this.totalCoinCounter = 0;
  }
},100);

 removeCoinAnimation =  this.throttle((coin:number)=>{
  const id = 'remove'+this.totalCoinCounter++;
  $('#gameContainer').append(`<div id=${id} class="removeCoins">- ${coin} coins</div>`);
  $("#"+id).animate({top: '-=50px'}).fadeOut(500, () => $("#"+id).remove());
 },100);
  
  async createChest(_this:any = this){
    while(this.destroyInProgress){
      await new Promise(r => setTimeout(r, 100));
    }
    if(_this.chestBuffer.length < 4){
      const chest = _this.game.add([
        _this.game.sprite('chest'),
        _this.game.pos(_this.game.width() -100 - _this.chestBuffer.length*100  , 10),
        _this.game.scale(1.5),
        _this.game.fixed(),
      ]);
      const label = _this.game.add([
        _this.game.text(`x${_this.chestCapacity}`),
        _this.game.pos(_this.game.width() - 100 - _this.chestBuffer.length*100  , 70),
        _this.game.scale(2),
        _this.game.fixed(),
      ])
      const key = _this.createKey();
      _this.chestBuffer.push({chest,label , key , hacking:false , hackTimer:0});
      if(_this.chestBuffer.length  > 1){
        _this.enableHack = true;
        _this.startHacking();
      }
    } 
    if (!_this.winOnce && _this.chestBuffer.length === 4){
        _this.showMessage(_this.gameLevels.winnig());
        _this.winOnce = true;
      }

    }

  async destroychest(_this:any = this , force = false){
    while(this.destroyInProgress){
      await new Promise(r => setTimeout(r, 100));
    }
    if(_this.chestBuffer.length && (_this.enableHack || force)){
      this.destroyInProgress = true;
      const len = _this.chestBuffer.length-1;
      _this.chestBuffer[len]?.chest.play('explode');
      _this.game.play("blast");
      await _this.delay(1000);
      _this.chestBuffer[len]?.chest.destroy();
      _this.chestBuffer[len]?.label.destroy();
      _this.chestBuffer[len]?.key.destroy();
      _this.chestBuffer.pop();
      //safety check
      _this.removeCoinAnimation(10);
      for(let i = len ; i < 4 ; ++ i){
        _this.chestBuffer[len]?.chest.destroy();
        _this.chestBuffer[len]?.label.destroy();
        _this.chestBuffer[len]?.key.destroy();
        _this.chestBuffer.splice(len,1);
      }
      this.destroyInProgress = false;
    }
  }


  createKey(){
      const key = this.game.add(
        [
          this.game.sprite('key'),
          this.game.pos(this.game.width() -70 - this.chestBuffer.length*100  , 110),
          this.game.origin('center'),
          this.game.scale(0.3),
          this.game.fixed(),
          this.game.rotate(90),
          this.game.opacity(0),
           'key',
        ]
      );
      key.play('bounce');
      return key;
  }

  createClouds(x=0){
    const heightRange = [260 , 400];
    const count =  Math.random() * 5;
    let nextX = x;
    for(let i = 0; i < count; i++){
      nextX = nextX + 100 + Math.random() * 1500;
      const nextY = heightRange[Math.floor(Math.random()*heightRange.length)];
      const cloud = this.game.add(
        [
          this.game.sprite('cloud'),
          this.game.pos(nextX, this.height - nextY),
          this.game.scale(1.7),
           'cloud',,
           'destroyItems'
        ]
      );
    }
  }

  createGround(x=0){
    this.game.add(
      [
        this.game.sprite('ground'),
        this.game.pos(x , this.height),
        this.game.scale(2),
        this.game.origin('botleft'),
        this.game.area({ width: 1200, height: 42 }),
        this.game.solid(),
        this.game.outview({offset: 1300}),
        'ground',
        'mainGround',
      ]
    );

  }

  createBlocks(x=0){
    const heightRange = [200 , 300];
    const count =  Math.random() * 10;
    let nextX = x;
    for(let i = 0; i < count; i++){
      nextX = nextX + 70 + Math.random() * 1000;
      const nextY = heightRange[Math.floor(Math.random()*heightRange.length)];
      this.game.add(
        [
          this.game.sprite('block'),
          this.game.pos(nextX, this.height - nextY),
          this.game.scale(2),
          this.game.origin('botleft'),
          this.game.area({ width: 61, height: 10 }),
          this.game.solid(),
          'ground',
          'destroyItems'
        ]
      );
    }
  };
  createCoins(x =0 ){
    const heightRange = [150 , 250 , 350];
    const count =  Math.random() * 10;
    let nextX = x;
    for(let i = 0; i < count; i++){
      nextX = nextX + 100 + Math.random() * 1000;
      const nextY = heightRange[Math.floor(Math.random()*heightRange.length)];
      this.game.add(
        [
          this.game.sprite('coin'),
          this.game.pos(nextX, this.height - nextY),
          this.game.scale(0.3),
          this.game.origin('center'),
          this.game.area({ width: 100, height: 100 }),
          'coin',
          'destroyItems'
        ]
      ).play('spin');

    }
  };

  createScrollKey(x =0 ){
    if(
      x >= 4800 &&
      (x/2400)%2 && 
      !this.evilMode){
      const heightRange = [150];
      const count =  1;
      let nextX = x;
      for(let i = 0; i < count; i++){
        nextX = nextX + 100 + Math.random() * 1000;
        const nextY = heightRange[Math.floor(Math.random()*heightRange.length)];
        this.game.add(
          [
            this.game.sprite('scrollKey'),
            this.game.pos(nextX, this.height - nextY),
            this.game.scale(0.09),
            this.game.origin('center'),
            this.game.area({ width: 700, height: 800 }),
            'scrollKey',
            'destroyItems'
          ]
        ).play('move');
  
      }
    }
   };

   createBombCoin(x = 0){
    if(x>2400*5 && (x/2400)%2 && !this.evilMode){
      const heightRange = [150 , 250 , 350];
      const count =  1;
      let nextX = x;
      for(let i = 0; i < count; i++){
        nextX = nextX + 100 + Math.random() * 1000;
        const nextY = heightRange[Math.floor(Math.random()*heightRange.length)];
        this.game.add(
          [
            this.game.sprite('blinkingCoin'),
            this.game.pos(nextX, this.height - nextY),
            this.game.scale(0.3),
            this.game.origin('center'),
            this.game.area({ width: 100, height: 100 }),
            'blinkingCoin',
            'destroyItems'
          ]
        ).play('spin');
  
      }
    }
   
  }

  createBirds(x = 0){
    const heightRange = [260 , 400];
    const count =  Math.random() * 5;
    let nextX = x;
    for(let i = 0; i < count; i++){
      nextX = nextX + 100 + Math.random() * 1500;
      const nextY = heightRange[Math.floor(Math.random()*heightRange.length)];

      this.game.add(
        [
          ...(this.evilMode ? this.evilCoinConfig() : this.birdConfig()),
          this.game.pos(nextX, this.height - nextY),
          this.game.origin('center'),
          this.game.solid(),
           'bird',
           'evil',
           'destroyItems'
        ]
      ).play(this.evilMode ? 'spin' : 'fly');

    }
  }

  createRedBirds(x = 0){
    if((x/2400)%2 && !this.evilMode){
      const heightRange = [260];
      const count =  1;
      let nextX = x;
      for(let i = 0; i < count; i++){
        nextX = nextX + 100 + Math.random() * 1500;
        const nextY = heightRange[Math.floor(Math.random()*heightRange.length)];
        this.game.add(
          [
            this.game.sprite('redBird'),
            this.game.pos(nextX, this.height - nextY),
            this.game.origin('center'),
            this.game.area({ width: 30, height: 20 }),
            this.game.scale(1.7),
            this.game.solid(),
             'redBird',
             'evil',
             'destroyItems'
          ]
        ).play('fly');
      }
    }

  }

  createEnemies(x = 0){
    const heightRange = [150];
    const count =  Math.random() * 5;
    let nextX = x;
    for(let i = 0; i < count; i++){
      nextX = nextX + 100 + Math.random() * 1500;
      const nextY = heightRange[0];
     this.game.add(
        [
          ...(this.evilMode ? this.evilCoinConfig() : this.enemyConfig()),
          this.game.pos(nextX, this.height - nextY),
          this.game.origin('center'),
          this.game.body(),
          'enemy',
          'evil',
          'destroyItems'
        ]
      ).play(this.evilMode ? 'spin' : 'run');
    }
  };



  enableDebug(status = true){
    this.game.debug.inspect = status;
  }


  //////////////////Levels/////////////////////////
  async startHacking(){
    if(this.gameLevels.displayCounter.hacking == 0){
      this.showMessage(this.gameLevels.hacking());
    }
    this.chestBuffer.forEach((item:any) => {
      item.key.use(this.game.opacity(1));
      item.chest.play('hacking');
    });
    for(let i = 0; i < this.chestBuffer.length; i++){
        await this.delay(15000);
        if(!this.enableHack || this.chestBuffer.length === 1){
          this.chestBuffer.forEach((item:any) => {
            item.key.use(this.game.opacity(0));
            item.chest.play('closed');
          });
          this.enableHack = false;
          break;
        }
        this.functionQueue.push({name: 'destroy' , func :this.destroychest});
    }
  }
  stopHacking(){
    if(this.enableHack){
      this.enableHack = false;
      if(this.gameLevels.displayCounter.hackingStoped == 0){
        this.showMessage(this.gameLevels.hackingStoped());
      }
      this.chestBuffer.forEach((item:any) => {
        item.key.use(this.game.opacity(0));
        item.chest.play('closed');
      });
    }

  }
}
