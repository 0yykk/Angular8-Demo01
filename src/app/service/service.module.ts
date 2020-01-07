import { NgModule, InjectionToken } from '@angular/core';

export const API_CONFIG = new InjectionToken('ApiconfigToken');

@NgModule({
  declarations: [],
  imports: [

  ],
  providers: [
    {provide: API_CONFIG, useValue: 'http://localhost:3000/'}
  ]
})
export class ServiceModule { }
