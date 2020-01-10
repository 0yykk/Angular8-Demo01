import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
// tslint:disable-next-line: max-line-length
import { getSongList, getPlayList, getCurrentIndex, getPlayer, getPlayMode, getCurrentSong } from 'src/app/store/selectors/player.selectors';
import { Song } from 'src/app/service/data-types/common.types';
import { PlayMode } from './player-types';
import { SetCurrentIndex, SetPlayMode, SetPlayList } from 'src/app/store/actions/player.actions';
import { Subscription, fromEvent } from 'rxjs';
import { inject } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { shuffle } from 'src/app/utils/array';


const modeType: PlayMode[] = [{
  type: 'loop',
  label: 'loop'
}, {
  type: 'random',
  label: 'random'
}, {
  type: 'singleLoop',
  label: 'singleLoop'
} ];

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.css']
})
export class WyPlayerComponent implements OnInit {

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

  // 音量
  volume = 60;

  // 是否显示音量面板
  showVolumnPanel = false;

  // 是否显示歌曲面板
  showPanel = false;

  // 是否点击的是音量面板本身
  selfClick = false;

  private winClick: Subscription;

  percent = 0;
  bufferPercent = 0;

  currentMode: PlayMode;
  modeCount = 0;
  @ViewChild('audio', {static: true}) private audio: ElementRef;
  private audioEl: HTMLAudioElement;

  constructor(
    private store$: Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc: Document
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


  // 音量
  onVolumeChange(per: number) {
    this.audioEl.volume = per / 100;
  }


  togglePanel(type: string) {
    this[type] = !this[type];
    if (this.showVolumnPanel || this.showPanel) {
      this.bindDocumentClickListener();
    } else {
      this.unbindDocumentClickListener();
    }
  }
  toggleListPanel() {
    if (this.songList.length) {
      this.togglePanel('showPanel');
    }
  }
  // 音量面板
  toggleVolPanel(evt: MouseEvent) {
    evt.stopPropagation();
    this.togglePanel('showVolumnPanel');
  }
  private bindDocumentClickListener() {
    if (!this.winClick) {
      this.winClick = fromEvent(this.doc, 'click').subscribe(() => {
        if (!this.selfClick) {
          this.showVolumnPanel = false;
          this.showPanel = false;
          this.unbindDocumentClickListener();
        } else {
          this.selfClick = false;
        }
      });
    }
  }
  private unbindDocumentClickListener() {
    if (this.winClick) {
      this.winClick.unsubscribe();
      this.winClick = null;
    }
  }

  private watchList(list: Song[], type: string) {
    this[type] = list;
  }

  private watchCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  private watchPlayMode(mode: PlayMode) {
    console.log('mode: ', mode);
    this.currentMode = mode;
    if (this.songList) {
      let list = this.songList.slice();
      if (mode.type === 'random') {
        list = shuffle(this.songList);
        this.updateCurrentIndex(list, this.currentSong);
        this.store$.dispatch(SetPlayList({ playList: list }));
      }
    }
  }

  private watchCurrentSong(song: Song) {
    if (song) {
      this.currentSong = song;
      this.duration = song.dt / 1000;
      console.log('song:', song);
    }

  }
  private updateCurrentIndex(list: Song[], song: Song) {
    const newIndex = list.findIndex(item => item.id === song.id);
    this.store$.dispatch(SetCurrentIndex({ currentIndex: newIndex}));
  }
  onPercentChange(per: number) {

    if (this.currentSong) {
      const currentTime =  this.duration * (per / 100);
      this.audioEl.currentTime = currentTime;
    }
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
    this.percent = (this.currentTime / this.duration) * 100;
    const buffered = this.audioEl.buffered;
    if (buffered.length && this.bufferPercent < 100) {
      this.bufferPercent = (buffered.end(0) / this.duration) * 100;
    }
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
      const newIndex = index < 0 ? this.playList.length - 1 : index;
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
  onEnded() {
    this.playing = false;
    if (this.currentMode.type === 'singleLoop') {
      this.loop();
    } else {
      this.onNext(this.currentIndex + 1);
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
// 播放模式
changeMode() {
  this.store$.dispatch(SetPlayMode({ playMode: modeType[++this.modeCount % 3] }));
}

  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : ' ';
  }
  // 点击列表改编歌曲

  onChangeSong(song: Song){
    this.updateCurrentIndex(this.playList, song);
  }
}
