import { Component, OnInit, Input, ViewChild, ElementRef, Renderer,
   AfterViewInit} from '@angular/core';

import { Word } from '../word';
import { Letter } from '../letter';
import { WordService } from '../word.service';
import { RewardsComponent } from '../rewards/rewards.component';
import { UserInfo } from '../user-info';
import { UserWord } from '../user-word';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

declare var responsiveVoice : any;

@Component({
  selector: 'app-word-spell',
  templateUrl: './word-spell.component.html',
  styleUrls: ['./word-spell.component.css'],

})

export class WordSpellComponent implements OnInit {

  @ViewChild('theInputField') theInputField:ElementRef;
  @ViewChild(RewardsComponent) rewardsC:RewardsComponent;
  private currentIndex : number = -1;
  speltWord : string = '';
  speltLetters : Letter[] = [];
  words : UserWord[];  
  userInfo : UserInfo;
  errorsInCurrent = false;
  static REQUIREDTIMESTOLEARN : number = 3;
  static MAXNOOFACTIVEWORDS : number = 15;
  mistakeWords : UserWord[] = [];
  private learnedNo :number = 0;
  showStart : boolean = true;
  currentWord : UserWord;
  correctWords : number = 0;
  activeWords : UserWord[] = [];


  constructor(private renderer: Renderer, private wordService: WordService, private http: HttpClient) { 
  }

  ngOnInit() {
  console.log("onInit start");
    this.getUserInfo();
    this.words = [];
    var firstWord : UserWord =  {
            "type": "phonic",
            "correctTimes": (WordSpellComponent.REQUIREDTIMESTOLEARN - 2),
            "spell": "start"
        }
    this.currentWord = firstWord;
    responsiveVoice.setDefaultVoice("BR English Female", {rate: 1.5});
 //   responsiveVoice.speak("Welcome to Spell Space! Ready? Start by writing 'start'!");

   // setTimeout(() => responsiveVoice.speak("O"),1000); //oa
   // setTimeout(() => responsiveVoice.speak("uh"), 1500); 
   // setTimeout(() => responsiveVoice.speak("a"), 2000); //ai
  //  
  //  setTimeout(() => responsiveVoice.speak(this.currentWord.spell), 500);
  }



  getUserInfo(): void {
    this.wordService.getUserInfo('5a4d4440734d1d15f675b8a6').subscribe(userInfo => this.setUserInfo(userInfo));
  }

  setLearnedWords() : void {
    for(var i = 0; i < this.words.length; i++ ) {
      if (this.words[i].correctTimes >= WordSpellComponent.REQUIREDTIMESTOLEARN){  
        this.rewardsC.addLearnedWord(this.words[i].spell, false);
        this.learnedNo++;
      }
    }
  }

  private setUserInfo(userInfo: UserInfo) {
    console.log(userInfo);
    this.userInfo = userInfo;
    if(userInfo.hasOwnProperty("userName")) {
      console.log('fecthed userInfo ' + userInfo.userName);
    } else {
      console.log("no userName");
    }
    console.log("fetched userInfo length " + this.userInfo.wordList.length);
    console.log(this.userInfo.wordList[0]);
    this.words = this.words.concat(userInfo.wordList);
    console.log("concatenated words " + this.words.length);
    this.setLearnedWords();
  }

  showError() {
    console.log("TODO: show error message " );
  }



  private getNewWord() {

    //TODO: limit new words so that there less than some max mistakewords & and correct but not learned word, max might be 30?
    console.log("Active Words"+ this.activeWords.length )
    if( this.activeWords.length > 0)
      console.log(this.activeWords[0]);

    var learnedWordProbability : number = 0.1;
    var mistakeProbability : number = this.mistakeWords.length / WordSpellComponent.MAXNOOFACTIVEWORDS;
    console.log("orig mistake prob " + mistakeProbability +"("+this.mistakeWords.length +"/"+WordSpellComponent.MAXNOOFACTIVEWORDS+")")
  
    if ( mistakeProbability > 0.90) {
      console.log("reducing probability");
      mistakeProbability = 0.9;
    }

    if(this.learnedNo == 0)
      learnedWordProbability = 0;
    if (this.mistakeWords.length == 0)
      mistakeProbability = 0;

    console.log("mistake probability (mistakeCount "
               + this.mistakeWords.length+ ")" +mistakeProbability 
               +" learnedWordProbability " + learnedWordProbability);

  
    //Let's not take new words if already max active words
    if ( this.activeWords.length >= WordSpellComponent.MAXNOOFACTIVEWORDS) {
        var rand: number = Math.random();
        if(rand < this.mistakeWords.length/(this.mistakeWords.length + this.activeWords.length))
          return this.mistakeWords.shift();
        else {
            var activeWord : UserWord = this.activeWords.shift()
            this.activeWords.push(activeWord); 
            return activeWord ;  
        }

    }

   

    var rand: number = Math.random();
    console.log("rand " + rand);
    if ( rand < learnedWordProbability) {
      console.log("LEARNED CHOSEN");
      //randomly select one of the learned words
      
      //random int between 0 and learnedNo
      var randLearnedWordIndex = Math.floor(Math.random() * 
                                 Math.floor(this.learnedNo));
      
      console.log("LearndIndex " + randLearnedWordIndex   
                  +" (0-"+this.learnedNo+")");
      var jjj = 0;
      for(var i = 0; i < this.words.length; i++ ) {
        if (this.words[i].correctTimes >= WordSpellComponent.REQUIREDTIMESTOLEARN){  
          if (jjj++ == randLearnedWordIndex)
            return this.words[i];
        }
      }
    } else if (rand >= learnedWordProbability && rand < mistakeProbability) {
     console.log("MISTAKE CHOSEN");
      return this.mistakeWords.shift();
    }

 console.log("NEW WORD CHOSEN");
    return this.getNextWordInList();
  }


  private getNextWordInList() {
    
    this.currentIndex++;
    console.log("get new word " + this.currentIndex + " ( of "+ this.words.length+")");
                //skipping sounds for now, as voice not correct,
    while(this.words[this.currentIndex].type ==='sound' || 
          this.words[this.currentIndex].correctTimes >WordSpellComponent.REQUIREDTIMESTOLEARN ) 
        this.currentIndex++;
   
    console.log( " " + this.words[this.currentIndex].spell 
        + " correct times "+ this.words[this.currentIndex].correctTimes);
    this.activeWords.push(this.words[this.currentIndex]);
    return this.words[this.currentIndex];
  }

  repeatWord() {
    if (this.currentWord) 
      responsiveVoice.speak(this.currentWord.spell);
    this.setFocus();
  }

  startPlaying() {
    responsiveVoice.speak("Welcome to Spell Space! Start by writing 'start'!");
    this.setFocus();
    this.showStart = false;
  }

  setFocus() {
   this.renderer.invokeElementMethod(this.theInputField.nativeElement, 'focus');
  }

  showWord() {
    this.speltWord = '';
    this.speltLetters = [];
    this.teachWord();
   /* this.currentWord = this.getNewWord();
    setTimeout(() =>  this.speltLetters = [], 4000);
    setTimeout(() => responsiveVoice.speak(this.currentWord.spell), 5000);*/
    this.correctWords--;
    this.setFocus();
   
  }

  giveReward() {
     this.rewardsC.giveReward();
  }

  animate5points() {
     this.rewardsC.givePoints();
  }


  checkProgress() :number {
    if(this.correctWords % 4 == 0 ) {
        this.giveReward();
        this.save();
        return 2000;

      } else if (this.correctWords % 5 == 0) { 
        this.giveReward();
        this.animate5points();
        return 2000;
      }
    return 0;
  }

  teachWord() {
     this.setSpeltLetters(this.currentWord.spell, ''); 
     this.errorsInCurrent = true;
     if( this.currentWord.correctTimes <0 ) //if teaching sight word 1st time
       this.currentWord.correctTimes = 0;
     //TODO animate nicely letter by letter
  }
  
 
  checkSpelling(speltWord : string ): void {
    this.speltLetters = [];
    if (!speltWord)
    	return;
   // console.log(speltWord + " vs " + this.currentWord.spell);
    this.setSpeltLetters(speltWord, this.currentWord.spell);

    if ( !this.isCorrectlySpelt(speltWord, this.currentWord.spell))  {
      this.errorsInCurrent = true;
      if ( !this.mistakeWords.includes(this.currentWord)) {
        this.mistakeWords.push(this.currentWord);
        console.log("pushed mistake word " + this.currentWord);
      }
    }  

    if (speltWord === this.currentWord.spell){
      var newWordTimeout : number = 1000;
      if ( !this.errorsInCurrent ) {
        this.currentWord.correctTimes++;
        console.log("Correct Word " + this.currentWord.spell + 
                    " ("+ this.currentWord.correctTimes + ")");
        if(this.currentWord.correctTimes == WordSpellComponent.REQUIREDTIMESTOLEARN){
          this.rewardsC.addLearnedWord(this.currentWord.spell, true);
          this.learnedNo++;

//TODO FIX: active words not dissapearing even if correctTimes >> REQUIREDTIMETOLEARN


          var index: number = this.activeWords.indexOf(this.currentWord);
          if(index > -1)
            this.activeWords.splice(index,1);
          console.log("Congratulations, you learned a word");
        }
        this.correctWords++;
        newWordTimeout += this.checkProgress();
      }

      console.log("Previous word " + this.currentWord.spell 
                  + " " + this.currentWord.correctTimes);
    	this.currentWord = this.getNewWord();
      this.speltWord = '';
      this.errorsInCurrent = false;
      setTimeout(() => this.speltLetters = [], newWordTimeout);
	    setTimeout(() => responsiveVoice.speak(this.currentWord.spell),    newWordTimeout );
      //needs teaching and not taught before
      if (this.currentWord.type=='sight' && this.currentWord.correctTimes <0)
        setTimeout(() => this.teachWord(), newWordTimeout + 500);
    }

    return;
  }

  save(): void {
     this.wordService.updateUserInfo(this.userInfo)
     .subscribe(() => console.log("SAVED") );
   }  

  private isCorrectlySpelt(written: string, correct: string) {
    var letters = written.toUpperCase().split('');
    var correctLetters = correct.toUpperCase().split(''); 
    for (var i = 0; i < letters.length; i++) {

        if (letters[i] !!= correctLetters[i]) {
            console.log("Mistake in word " + letters[i] + " (not " + correctLetters[i]);
            this.errorsInCurrent = true;
            return false;
        }
      } 

    return true;   
  } 

  private setSpeltLetters(written : string, correct : string) {
    var letters = written.toUpperCase().split('');
    var correctLetters = correct.toUpperCase().split(''); 
    for (var i = 0; i < letters.length; i++) {
        this.speltLetters.push({letter: letters[i], isCorrect: letters[i]== correctLetters[i]});
      }  
  }

}
