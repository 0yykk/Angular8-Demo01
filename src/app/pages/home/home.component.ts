import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/service/home.service';
import { Banner, HotTag, SongSheet } from 'src/app/service/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  carouselActiveIndex = 0;
  banners: Banner[];
  hotTags: HotTag[];
  songSheetList: SongSheet[];
  @ViewChild(NzCarouselComponent, { static: true }) private nzCarousel: NzCarouselComponent;

  constructor(private homeserve: HomeService) {
    this.getBanners();
    this.getHotTag();
    this.getPersonalSheetList();
  }

  private getBanners() {
    this.homeserve.getBanners().subscribe(banners => {
      this.banners = banners;
    });
  }

  private getHotTag() {
    this.homeserve.getHotTags().subscribe(hotTags => {
      this.hotTags = hotTags;
    });
  }
  private getPersonalSheetList() {
    this.homeserve.getPersonalSheetList().subscribe(songSheetList => {
      this.songSheetList = songSheetList;
    });
  }
  ngOnInit() {
  }

  onBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }
  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }
}
