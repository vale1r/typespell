import { Component, OnInit,
    trigger,
    state,
    style,
    transition,
    animate,
    keyframes } from '@angular/core';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css'],
    animations: [
        trigger('showReward', [
            state('inactive', style({
                visibility: 'hidden',
                transform: 'scale(1)',
            })),
            state('active', style({
                transform: 'scale(3)',
                visibility: 'visible'
            })),
            transition('inactive => active', animate('2000ms ease-in')),
            transition('active => inactive', animate('1000ms ease-out'))
        ]),
		trigger('showPoints', [
            state('inactive', style({
                visibility: 'hidden',
                transform: 'scale(1)',
            })),
            state('active', style({
                transform: 'scale(3)',
                visibility: 'visible'
            })),
            transition('inactive => active', animate('2000ms ease-in')),
            transition('active => inactive', animate('1000ms ease-out'))
        ]),
        trigger('learnedWord', [
            state('inactive', style({
                visibility: 'hidden',
                transform: 'scale(1)',
            })),
            state('active', style({
                transform: 'scale(3)',
                visibility: 'visible'
            })),
            transition('inactive => active', animate('2000ms ease-in')),
            transition('active => inactive', animate('1000ms ease-out'))
        ]),
    ]
})

export class RewardsComponent implements OnInit {

  rewards : string[] = [];
  learnedWords : string[] = [];
  rewardState: string = 'inactive';
  pointState: string = 'inactive';
  learnedWordState: string = 'inactive';

  constructor() { }

  ngOnInit() {
  }

  addLearnedWord(word: string, showAnimation: boolean ) {
	this.learnedWords.push(word);
   	if ( showAnimation) {
		this.learnedWordState = (this.learnedWordState === 	'inactive' ? 'active' : 'inactive');
      	setTimeout(() => 
        	this.learnedWordState = (this.learnedWordState === 'inactive' ? 'active' : 'inactive'), 3000);
	}
  }


  giveReward() {
  		console.log("Giving reward");
	 this.rewardState = (this.rewardState === 'inactive' ? 'active' : 'inactive');
     this.rewards.push('S');
     setTimeout(() => 
         this.rewardState = (this.rewardState === 'inactive' ? 'active' : 'inactive'), 3000);

  }

  givePoints() {
  	console.log("GIving points");
	this.pointState = (this.pointState === 'inactive' ? 'active' : 'inactive');
    setTimeout(() => 
         this.pointState = (this.pointState === 'inactive' ? 'active' : 'inactive'), 3000);
  }

}
