import { spawn } from '@redux-saga/core/effects';
import { takeWatcher, takeWatcher1, forkWatcher, applyWatcher } from './take';

function* rootSaga() {
    yield spawn(takeWatcher);
    yield spawn(takeWatcher1);
    yield spawn(forkWatcher);
    yield spawn(applyWatcher);
}

export default rootSaga;