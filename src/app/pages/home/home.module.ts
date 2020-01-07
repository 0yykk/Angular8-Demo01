import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { ShareModule } from 'src/app/share/share.module';
import { HomeComponent } from './home.component';
import { WyyCarouselComponent } from './components/wyy-carousel/wyy-carousel.component';


@NgModule({
  declarations: [HomeComponent, WyyCarouselComponent],
  imports: [
    ShareModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
