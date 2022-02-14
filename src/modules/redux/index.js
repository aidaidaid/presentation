import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from 'redux-saga';
import rootSaga from "../saga/index.js";
import reducerInfo from './reducer';

///////////////////SAGA MONITOR////////////////////////////

// const watchEffectEnd = (effectId, res) => {
//   console.log('watch effect id', effectId);
//   console.log('watch effect', res);
// };

const sagaMiddleware = createSagaMiddleware({
  sagaMonitor: {
    // rootSagaStarted: (id, e) => {
    //   console.log('event rootSaga started', id);
    // },
    // effectCancelled: () => {
    //   console.log('cancelled');
    // },
    // effectRejected: (e) => {
    //   console.log('rejected', e);
    // },
    // effectResolved: watchEffectEnd,
    // effectTriggered: (event) => {
    //   console.log('*** effect tiggered ***', event);
    // }
  }
});

///////////////////////////////////////////////////////////

export const store = createStore(reducerInfo, 
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(rootSaga);