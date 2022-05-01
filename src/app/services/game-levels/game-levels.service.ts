import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameLevelsService {

  displayCounter = {
    intro : 0,
    hacking : 0,
    hackingStoped : 0,
    phising : 0,
    phisingBlocked : 0,
    bomb : 0,
    winnig : 0
  }
  constructor() { }

  intro() {
  const from = `boss@dinoHQ`
  const text =
`Greetings dino,You are entering the cyber-space, be careful of the hackers.<br>
Saving the right message will give you extra coins. <br>
Your mission is to collect 80 coins or 4 coin-chests.<br>
`
    this.displayCounter.intro++;
   return {from, text};
  }

  hacking(){
    const from = `boss@dinoHQ`
    const text =
`Your chest keys got leaked.  <br>
Kill a red bird to get a new random key.  <br>
`
    this.displayCounter.hacking++;
      return {from, text};
  }

  hackingStoped(){
    const from = `boss@dinoHQ`
    const text =
`Well done, <br>
You have updated your chest keys. <br>
hacking is blocked, but not for long.
`
this.displayCounter.hackingStoped++;
       return {from, text};
  }

  phising(){
    const from = `boss@holydinoHQ`
    const text =
`Bravo, <br>
You have won 100 coins. <br>
Auto-save will add this to your chest.
`
this.displayCounter.phising++;
       return {from, text , counter:5 , hack:true};
  }

  phisingBlocked(){
    const from = `boss@dinoHQ`
    const text =
`You were a target of phishing attack, <br>
Make sure to only accept message from @dinoHQ.<br>
hacking is blocked, but not for long.
`
this.displayCounter.phisingBlocked++;
       return {from, text};
  }

  bomb(){
    const from = `boss@dinoHQ`
    const text =
`You were a target of hardware trojan attack, <br>
All that glitters is not gold. <br>
Dont collect suspicious coins before consulting @dinoHQ.
`
this.displayCounter.bomb++;
       return {from, text};
  }

  winnig(){
    const from = `boss@dinoHQ`
    const text =
`Congratulation, <br>
You are entering the endless run mode.
`
this.displayCounter.winnig++;
       return {from, text};

  }

}
