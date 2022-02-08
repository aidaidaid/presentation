import { spawn } from '@redux-saga/core/effects';
import { takeWatcher, takeWatcher1 } from './take';

function* rootSaga() {
    yield spawn(takeWatcher);
    yield spawn(takeWatcher1)
}

export default rootSaga;