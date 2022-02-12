import { spawn } from '@redux-saga/core/effects';
import { takeWatcher, forkWatcher, applyWatcher, throttleDebounceWatcher, allWatcher, raceWatcher, takeLeadingWatcher, takeEveryWatcher, takeLatestWatcher, actionChannelWatcher, eventChannelWatcher, channelWatcher } from './sagas';

function* rootSaga() {
    yield spawn(takeWatcher);
    yield spawn(takeLeadingWatcher);
    yield spawn(takeEveryWatcher);
    yield spawn(takeLatestWatcher);
    yield spawn(forkWatcher);
    yield spawn(applyWatcher);
    yield spawn(allWatcher);
    yield spawn(raceWatcher);
    yield spawn(throttleDebounceWatcher);
    yield spawn(channelWatcher);
    yield spawn(actionChannelWatcher);
    yield spawn(eventChannelWatcher);
}

export default rootSaga;