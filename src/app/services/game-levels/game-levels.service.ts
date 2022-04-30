import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameLevelsService {

  constructor() { }

  intro() {
  const from = `boss@dinoHQ`
  const text =
`Greetings dino, 
You are entering the cyber-space, be careful of the hackers.
Your mission is to collect 4 chests.
`
   return {from, text};
  }

  hacking(){
    const from = `boss@dinoHQ`
    const text =
`Your chest keys got leaked.
Kill a red bird to get a new random key.
`
      return {from, text};
  }

  hackingStoped(){
    const from = `boss@dinoHQ`
    const text =
`Well done,
You have updated your chest keys.
hacking is blocked, but not for long.
`
       return {from, text};
  }

  phising(){
    const from = `boss@holydinoHQ`
    const text =
`Hurray,
You have won 100 coins.
Click accept to add to your chest.
`
       return {from, text};
  }

  phisingBlocked(){
    const from = `boss@dinoHQ`
    const text =
`You were a target of phishing attack,
Make sure to only accept message from @dinoHQ.
hacking is blocked, but not for long.
`
       return {from, text};
  }

  bomb(){
    const from = `boss@dinoHQ`
    const text =
`You were a target of hardware trojan attack,
All that glitters is not gold.
Dont collect suspicious coins before consulting @dinoHQ.
`
       return {from, text};
  }

  winnig(){
    const from = `boss@dinoHQ`
    const text =
`Congratulation,
You are entering the endless run mode.
`
       return {from, text};

  }

}
