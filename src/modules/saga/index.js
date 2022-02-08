import { spawn } from '@redux-saga/core/effects';
import {
    takeWatcher,
    takeWatcher1,
    forkWatcher,
    applyWatcher,
    takeLeadingWatcher,
    takeEveryWatcher,
    takeLatestWatcher, allWatcher, raceWatcher
} from './take';
import { takeWatcher, takeWatcher1, forkWatcher, applyWatcher, throttleDebounceWatcher, cancelWatcher } from './take';

function* rootSaga() {
    yield spawn(takeWatcher);
    yield spawn(takeLeadingWatcher);
    yield spawn(takeEveryWatcher);
    yield spawn(takeLatestWatcher);
    // yield spawn(takeWatcher1);
    yield spawn(forkWatcher);
    yield spawn(applyWatcher);
    yield spawn(allWatcher);
    yield spawn(raceWatcher);
    yield spawn(throttleDebounceWatcher);
    // yield spawn(cancelWatcher);
}

export default rootSaga;