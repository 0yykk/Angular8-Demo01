import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-types';
import { Song } from 'src/app/service/data-types/common.types';
import { createReducer, on, Action} from '@ngrx/store';
import { SetPlaying, SetPlayList, SetSongList, SetPlayMode, SetCurrentIndex } from '../actions/player.actions';

export interface PlayState {
    playing: boolean;

    playMode: PlayMode;

    songList: Song[];

    playList: Song[];

    currentIndex: number;
}

export const initialState: PlayState = {
    playing: false,
    songList: [],
    playList: [],
    playMode: {type: 'loop', label: 'loop'},
    currentIndex: -1
};

const reducer = createReducer(
    initialState,
    on(SetPlaying, (state, { playing }) => ({...state, playing})),
    on(SetPlayList, (state, { playList }) => ({...state, playList})),
    on(SetSongList, (state, { songList }) => ({...state, songList})),
    on(SetPlayMode, (state, { playMode }) => ({...state, playMode})),
    on(SetCurrentIndex, (state, { currentIndex }) => ({...state, currentIndex}))
    );


export function playerReducer(state: PlayState, action: Action) {
  return reducer(state, action);
}
