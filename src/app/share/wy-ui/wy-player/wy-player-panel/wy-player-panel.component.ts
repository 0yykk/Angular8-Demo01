import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Song } from 'src/app/service/data-types/common.types';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';


@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.css']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges{

  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() currentIndex: number;
  @Input() show: boolean;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onClose = new EventEmitter<void>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onChangeSong = new EventEmitter<Song>();

  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;
  
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.songList) {
      console.log('songList :', this.songList);
    }
    if (changes.currentSong) {
      console.log('currentSong :', this.currentSong);
    }
    if (changes.show) {
      if (!changes.show.firstChange && this.show) {
        this.wyScroll.first.refreshScroll();
      }
    }
  }
}
