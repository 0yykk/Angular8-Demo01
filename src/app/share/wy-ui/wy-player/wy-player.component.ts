import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
// tslint:disable-next-line: max-line-length
import { getSongList, getPlayList, getCurrentIndex, getPlayer, getPlayMode, getCurrentSong } from 'src/app/store/selectors/player.selectors';
import { Song } from 'src/app/service/data-types/common.types';
import { PlayMode } from './player-types';
import { SetCurrentIndex } from 'src/app/store/actions/player.actions';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.css']
})
export class WyPlayerComponent implements OnInit {
  sliderValue = 0;
  bufferOffset = 0;

  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;

  duration: number;
  currentTime: number;

  // 播放状态
  playing = false;

  // 是否可以播放
  songReady = false;

  @ViewChild('audio', {static: true}) private audio: ElementRef;
  private audioEl: HTMLAudioElement;

  constructor(
    private store$: Store<AppStoreModule>
  ) {
    const appStore$ = this.store$.pipe(select(getPlayer));
    appStore$.pipe(select(getSongList)).subscribe(list => this.watchList(list, 'songList'));
    appStore$.pipe(select(getPlayList)).subscribe(list => this.watchList(list, 'playList'));
    appStore$.pipe(select(getCurrentIndex)).subscribe(index => this.watchCurrentIndex(index));
    appStore$.pipe(select(getPlayMode)).subscribe(mode => this.watchPlayMode(mode));
    appStore$.pipe(select(getCurrentSong)).subscribe(song => this.watchCurrentSong(song));



  }

  ngOnInit() {
    this.audioEl = this.audio.nativeElement;
    console.log('audio: ', this.audio.nativeElement);
  }




  private watchList(list: Song[], type: string) {
    this[type] = list;
  }

  private watchCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  private watchPlayMode(mode: PlayMode) {
    console.log('mode: ', mode);
  }

  private watchCurrentSong(song: Song) {
    if (song) {
      this.currentSong = song;
      this.duration = song.dt / 1000;
      console.log('song:', song);
    }

  }
  onPercentChange(per) {

    this.audioEl.currentTime = this.duration * (per / 100);
  }

  onCanplay() {
    this.songReady = true;
    this.play();
  }

  private play() {
    this.audioEl.play();
    this.playing = true;
  }
  onTimeUpdate(e: Event) {
    this.currentTime = (e.target as HTMLAudioElement).currentTime;
 }
 // 播放暂停
  onToggle() {
    if (!this.currentSong) {
      if (this.playList.length) {
         this.updateIndex(0);
      }
    } else {

    }
    if (this.songReady) {
      this.playing = !this.playing;
      if (this.playing) {
        this.audioEl.play();
      } else {
        this.audioEl.pause();
      }
    }
 }

 // 上一曲
  onPrev(index: number) {
    if (!this.songReady) { return; }
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index <= 0 ? this.playList.length - 1 : index;
      this.updateIndex(newIndex);
    }
  }

   // 下一曲
   onNext(index: number) {
    if (!this.songReady) { return; }
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index >= this.playList.length ? 0 : index;
      this.updateIndex(newIndex);
    }

  }
private updateIndex(index: number) {
  this.store$.dispatch(SetCurrentIndex({ currentIndex: index}));
  this.songReady = false;
}
// 单曲循环
private loop() {
  this.audioEl.currentTime = 0;
  this.play();
}

  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : ' ';
  }

}
