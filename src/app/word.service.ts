import { Injectable } from '@angular/core';
import { UserWord } from './user-word';
import { Word } from './word';
import { UserInfo } from './user-info';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of'
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { catchError, tap, map } from 'rxjs/operators';
import { WORDLIST } from './word-list';
import { MessageService } from './message.service';

@Injectable()
export class WordService {

  

  private wordListUrl = 'http://localhost:8000/users';
  //private wordListUrl = 'localhost:8000/wordlists/5a3ac3f3734d1d31bc858d64';
 //static STATICUSERID = '5a4d4440734d1d15f675b8a6'; //taika
 static STATICUSERID = '5a6657be734d1d72fc090d4d' ; //elsi

  constructor(
  		private http: HttpClient,
  		private messageService: MessageService) {}

  getWords() : Word[] {
  	return WORDLIST;
  }

  /** Log a WordService message with the MessageService */
  private log(message: string) {
  		this.messageService.add('WordService: ' + message);
  }

  getUserInfo(id: string): Observable<UserInfo> {
  	console.log("Get user info obs");
  	id = WordService.STATICUSERID;
  	const url = `${this.wordListUrl}/${id}`;
  	console.log("get url " + url);
  	return this.http.get<UserInfo>(url)
  		.pipe(
 //     	catchError(this.handleError('getUserInfo'))
	    ) ;
  }


	/** PUT: update the UserInfo on the server */
	updateUserInfo (userInfo: UserInfo): Observable<any> {
		var id : string = WordService.STATICUSERID;
  		const url = `${this.wordListUrl}/${id}`;
 		return this.http.put(url, userInfo).pipe(
    		tap(_ => this.log(`updated userInfo id=${userInfo.userName}`)),
    		catchError(this.handleError<any>('updateUserInfo'))
		);
	}

/*
  getUserInfo(id: string): Observable<UserInfo> {
  	console.log("Get user info obs");
	id = '5a4d4440734d1d15f675b8a6';
    const url = `${this.wordListUrl}/${id}`;
    console.log("get url " + url);
    return this.http.get<UserInfo>(url).pipe(
      tap(_ => this.log(`fetched user id=${id}`)),
      catchError(this.handleError<UserInfo>(`getUserInfo id=${id}`))
    );
  }

  getUserInfo() : Observable<UserInfo> {  //TODO
  	return this.http.get<UserInfo>(this.wordListUrl)
  		//.pipe(
  		//	catchError(this.handleError('getUserInfo', []))
  		//);
  }*/

/*
private extractWordlist(list: WordList) :  Word[]{
	console.log("LIST"+ list.words);
	return list.words;
}*/
  
private handleError<T> (operation = 'operation', result?: T) {
	console.log("Handling errors");
  return (error: any): Observable<T> => {
 
    // TODO: send the error to remote logging infrastructure
    console.log(error); // log to console instead
 
    // TODO: better job of transforming error for user consumption
   // this.log(`${operation} failed: ${error.message}`);
 
    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}

}
