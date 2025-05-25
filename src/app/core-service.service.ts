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

  getQueryUrl(query: string): string {
    return `https://api.core.ac.uk/v3/search/works?q=${query}`;
  }

  getCoreData(query: string): Observable<CoreInterface> {
    return this.http.get<CoreInterface>(`${this.getQueryUrl(query)}`);
  }

}
