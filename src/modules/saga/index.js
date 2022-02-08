import { spawn } from '@redux-saga/core/effects';
import { takeWatcher, takeWatcher1, forkWatcher, applyWatcher, throttleDebounceWatcher } from './take';

function* rootSaga() {
    yield spawn(takeWatcher);
    yield spawn(takeWatcher1);
    yield spawn(forkWatcher);
    yield spawn(applyWatcher);
    yield spawn(throttleDebounceWatcher);
}

export default rootSaga;