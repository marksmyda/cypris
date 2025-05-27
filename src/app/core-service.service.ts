import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Aggregation, CoreInterface } from './core-interface';
import { environment as env } from '../environments/environment';

const BASE_URL: string = env.apiUrl;

interface Sort {
  field: string;
  order: number;
}

interface Pagination {
  limit: number;
  offset: number;
}

@Injectable({
  providedIn: 'root'
})
export class CoreServiceService {

  readonly headers = new HttpHeaders().set('Authorization', `Bearer ${env.token}`);

  constructor(private http: HttpClient) { }

  buildQueryforGet(search: string, pagination: Pagination, sort?: Sort): string {
    let uri: string = `${BASE_URL}?limit=${pagination.limit}&offset=${pagination.offset}`;
    if (search) {
     uri = `${uri}&q=(${this.getQualifiedSearchString(search)})`
    }
    if (sort) {
      uri = `${uri}&sort=${sort.field}:${sort.order === 1 ? 'asc' : 'desc'}` 
    }
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

  getCoreData(query: string, pagination: Pagination, sort?: Sort): Observable<CoreInterface> {
    return this.http.get<CoreInterface>(`
      ${this.buildQueryforGet(query, pagination, sort)}
    `, { headers: this.headers });
  }

  postForAggregation(search: string, aggregations: string[]) {
    return this.http.post<Aggregation>(`${BASE_URL}aggregate`, {
      q: search,
      aggregations
    }, { headers: this.headers });
  }

}
