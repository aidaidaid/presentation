import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { forkEffect, getPosts, applyEffect, cancelEffect, takeEffect, takeLeadingEffect, takeLatestEffect, takeEveryEffect, allEffect, raceEffect, getPostsActionChannel, actionChannel, eventChannel, eventChannelUnsubscribe, channel } from './modules/saga/actions';
import { store } from './modules/redux';
import { actionTypes } from './modules/saga/actionTypes';

const App = () => {
  const dispatch = useDispatch();
  const filesUploadingProgress = useSelector((state) => state.filesUploading);

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

  const handleActionChannel = () => {
    try {
      for (let dispatchId = 1; dispatchId <= 4; dispatchId++) {
        dispatch(actionChannel({userId: 1, dispatchId}))
      }
    } catch (e) {
      console.log('error', e.message) // error Channel's Buffer overflow!
    }
  }
  
  return (
    <div className='common'>
      <div>
        <button onClick={()=>dispatch(takeEffect())}>Take</button>
        <button onClick={()=>dispatch(takeLeadingEffect())}>Take Leading</button>
        <button onClick={()=>dispatch(takeLatestEffect())}>Take Latest</button>
        <button onClick={()=>dispatch(takeEveryEffect())}>Take Every</button>
        <button onClick={()=>dispatch(allEffect())}>All</button>
        <button onClick={()=>dispatch(raceEffect())}>Racer</button>
      </div>
    <div>
      <button onClick={()=>dispatch(forkEffect())}>Fork/Call/Spawn</button>
      <button onClick={()=>dispatch(cancelEffect())}>Cancel</button>
      <button onClick={()=>dispatch(applyEffect())}>Call/Apply</button>
      <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'row'}}>
        <input type="text" placeholder="Throttle/Debounce" onChange={handleUsernameChange}></input>
      </div>
      <button onClick={()=>handleActionChannel()}>Action Channel</button>
      <button onClick={()=>dispatch(eventChannel())}>Event Channel</button>
      <button onClick={()=>dispatch(channel())}>Channel</button>
      <p style={{textAlign: 'center', margin: 0}}>Uploading progress {filesUploadingProgress}</p>
    </div>
    </div>
  )
}

export default App;