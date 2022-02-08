import logo from './logo.svg';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  forkEffect,
  getPosts,
  applyEffect,
  takeEffect,
  takeLeadingEffect,
  takeLatestEffect, takeEveryEffect, allEffect, raceEffect
} from './modules/saga/actions';
import { forkEffect, getPosts, applyEffect, actionTypes, cancelEffect } from './modules/saga/actions';
import { store } from './modules/redux';

const App = () => {
  // const selector = useSelector();
  const dispatch = useDispatch();

  // const getPost = () => {
  //   debugger
  //   // debugger
  //   // dispatch(getPosts());
  //   store.dispatch({"PUT"});
  // }

  // const getPostResolve = () => {
  //   debugger

  //   store.dispatch({"PUT_RESOLVE"});
  // }


  const action = e => {
    store.dispatch({type:e });
  }

  const handleUsernameChange = (event) => {
    dispatch({
      type: actionTypes.CHANGE_USERNAME,
      payload: {
        username: event.target.value,
      },
    })
  }

  return (
    <div>
      <button onClick={()=>action("PUT")}>Put</button>
      <button onClick={()=>action("PUT_RESOLVE")}>PutResolve</button>
      <button onClick={()=>action("PUT_RESOLVE")}>All</button>
      <button onClick={()=>action("PUT_RESOLVE")}>Race</button>
      <button onClick={()=>dispatch(forkEffect())}>Fork/Call/Spawn</button>
      <button onClick={()=>dispatch(applyEffect())}>Apply</button>
      <button onClick={()=>dispatch(takeEffect())}>Take</button>
      <button onClick={()=>dispatch(takeLeadingEffect())}>Take Leading</button>
      <button onClick={()=>dispatch(takeLatestEffect())}>Take Latest</button>
      <button onClick={()=>dispatch(takeEveryEffect())}>Take Every</button>
      <button onClick={()=>dispatch(allEffect())}>All</button>
      <button onClick={()=>dispatch(raceEffect())}>Racer</button>
      <button onClick={()=>dispatch(cancelEffect())}>Cancel</button>
      <input
        type="text"
        placeholder="Username"
        onChange={handleUsernameChange}>
      </input>
    </div>
  )
}

export default App;