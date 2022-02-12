import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from 'redux-saga';
import rootSaga from "../saga/index.js";
import reducerInfo from './reducer';

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(reducerInfo, 
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(rootSaga);