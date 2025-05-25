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

  buildQueryforGet(query: string, limit: string): string {
    return `https://api.core.ac.uk/v3/search/works?q=(${query})&limit=${limit}`;
  }

  getCoreData(query: string, limit: string): Observable<CoreInterface> {
    return this.http.get<CoreInterface>(`
      ${this.buildQueryforGet(query, limit)}
    `);
  }

}
