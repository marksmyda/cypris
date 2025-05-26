import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoreInterface } from './core-interface';

@Injectable({
  providedIn: 'root'
})
export class CoreServiceService {

  readonly token = 'Qmp08PTy6ZSBGejJHsNvfKEMUdlkautC';
  readonly headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

  constructor(private http: HttpClient) { }

  buildQueryforGet(search: string, limit: string): string {
    const uri = `https://api.core.ac.uk/v3/search/works?q=(${this.getQualifiedSearchString(search)})&limit=${limit}`;
    console.log(new Date(Date.now()).toTimeString() + " | GET request to: " + uri);

    return uri;
  }

  getQualifiedSearchString(search: string): string {
    const tokens = search.split(new RegExp(`(AND)|(OR)|(\\()|(\\))|(\\s+)`, 'i')).filter(item => item !== undefined && item !== '');

    return tokens.map(token => {
      if (['AND', 'OR', '(', ')'].includes(token.toUpperCase())) {
        return token.toUpperCase();
      } else if (token.trim() === '') {
        return ' ';
      } else {
        return `fullText:"${token}"`;
      }
    }).join('');
  }

  getCoreData(query: string, limit: string): Observable<CoreInterface> {
    return this.http.get<CoreInterface>(`
      ${this.buildQueryforGet(query, limit)}
    `);
  }

}
