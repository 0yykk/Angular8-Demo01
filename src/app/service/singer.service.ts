import { Injectable, Inject } from '@angular/core';
import { ServiceModule, API_CONFIG } from './service.module';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Singer } from './data-types/common.types';
import {map} from 'rxjs/internal/operators';
import queryString from 'query-string';

interface SingerParam {
  offset: number;
  limit: number;
  cat?: string;
}

const defaultParams: SingerParam = {
  offset: 0,
  limit: 9,
  cat: '5001'
};

@Injectable({
  providedIn: ServiceModule
})
export class SingerService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getEnterSinger(args: SingerParam = defaultParams): Observable<Singer[]> {
    const params = new HttpParams({ fromString: queryString.stringify(args) });
    return this.http.get(this.uri + 'artist/list', { params })
    .pipe(map((res: {artists: Singer[]}) => res.artists));
  }

}
