import { NgModule, SkipSelf, Optional } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { ServiceModule } from '../service/service.module';
import { PagesModule } from '../pages/pages.module';
import { ShareModule } from '../share/share.module';
import { registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import { NZ_I18N, en_US } from 'ng-zorro-antd';
import { AppStoreModule } from '../store';
registerLocaleData(en);

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    ServiceModule,
    PagesModule,
    ShareModule,
    AppStoreModule,
    AppRoutingModule,
  ],
  exports: [
    ShareModule,
    AppRoutingModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
})
export class CoreModule {
  constructor(@SkipSelf() @Optional() parentModule: CoreModule ) {
    if (parentModule) {
      throw new Error('Coremodule can only be introduced by Appmodule');
    }
  }
}
