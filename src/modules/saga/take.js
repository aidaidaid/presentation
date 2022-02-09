import { takeEvery, call, apply, put, delay, putResolve, select, fork, spawn, join, throttle, debounce, cancelled, cancel, take, all, race, takeLeading, takeLatest} from 'redux-saga/effects';
import { saveName } from '../api/user';
import { setComments, setPosts } from '../redux/actions';
import { actionTypes } from './actions';


const getData = async(url) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/${url}`).then(res => res.json()).catch(e => console.warn("getData", e));
    return response;    
};

const fetchSmth = result => dispatch => //redux-thunk example
  delay(500).then(() => dispatch({type: 'SET_POSTS',payload:result}));

/////////////////////////////////////
function* applyWorker() { //apply и call с контекстом
  const fetchWithApplyFN = () => {
    return {
      getUrl(id) {
        return `https://jsonplaceholder.typicode.com/posts/${id}`
        // `${baseUrl}/users/${userId}/posts`
      },
      getPosts(id) {
        console.log('apply effect')
        return fetch(this.getUrl(id)).then((response) => response.json())
      },
    }
  }
  
  const fetchWithApply = fetchWithApplyFN();
  const post = yield apply(fetchWithApply, fetchWithApply.getPosts, [5]);
//   const post = yield call([fetchWithApply, fetchWithApply.getPosts], 5);
  console.log(post);
}
//////////////////////////////////////
//▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ Ненужные воркеры
// export function* takeWorker1() {
//     try {
//         const result = yield call(getData, `posts`);
//         // const result = yield call(delayFN, 1000, 'posts' );
//         // if(actionTypes.PUT){
//         yield put(setPosts(result));
//             // yield put(fetchSmth(result));
//             console.log("state after PUT", yield select());
//         // }
//         // else if(actionTypes.PUT_RESOLVE){
//         //     yield putResolve(fetchSmth(result));
//         //     console.log("state after PUT_RESOLVE", yield select());
//         // }
//         // yield put(setPosts(result)); //вызывает dispatch
//         console.log(result)
//
//     }
//     catch (error) {
//         console.warn(error);
//     }
// }
//
// export function* takeWorker2() {
//     try {
//         const result = yield call(getData, `https://jsonplaceholder.typicode.com/posts`);
//         // const result = yield fork(delayFN, 2000, 'posts' );
//         // if(actionTypes.PUT){
//         //     yield put(fetchSmth(result));
//         //     console.log("state after PUT", yield select());
//         // }
//         // else if(actionTypes.PUT_RESOLVE){
//             yield putResolve(fetchSmth(result));
//             console.log("state after PUT_RESOLVE", yield select());
//         // }
//         // yield put(setPosts(result));
//         console.log(result)
//
//     }
//     catch (error) {
//         console.warn(error);
//     }
// }
//
// function* takeWorker1() {
//     try {
//         const result = yield call(getData, `posts`);
//         // const result = yield call(delayFN, 1000, 'posts' );
//         // if(actionTypes.PUT){
//         yield put(setPosts(result));
//             // yield put(fetchSmth(result));
//             console.log("state after PUT", yield select());
//         // }
//         // else if(actionTypes.PUT_RESOLVE){
//         //     yield putResolve(fetchSmth(result));
//         //     console.log("state after PUT_RESOLVE", yield select());
//         // }
//         // yield put(setPosts(result)); //вызывает dispatch
//         console.log(result)
//
//     }
//     catch (error) {
//         console.warn(error);
//     }
// }
//
// function* takeWorker2() {
//     try {
//         const result = yield call(getData, `https://jsonplaceholder.typicode.com/posts`);
//         // const result = yield fork(delayFN, 2000, 'posts' );
//         // if(actionTypes.PUT){
//         //     yield put(fetchSmth(result));
//         //     console.log("state after PUT", yield select());
//         // }
//         // else if(actionTypes.PUT_RESOLVE){
//             yield putResolve(fetchSmth(result));
//             console.log("state after PUT_RESOLVE", yield select());
//         // }
//         // yield put(setPosts(result));
//         console.log(result)
//
//     }
//     catch (error) {
//         console.warn(error);
//     }
// }
//▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ Ненужные воркеры

// function* bgSync() {
//     try {
//       while (true) {
//         // yield put(actions.requestStart())
//         const result = yield call(getData, 'posts' );
//         console.log('load posts', result);
//         // yield put(actions.requestSuccess(result))
//         yield delay(5000)
//       }
//     } finally {
//       if (yield cancelled())
//         console.log('Sync cancelled!');
//         // yield put(actions.requestFailure('Sync cancelled!'))
//     }
//   }

// function* cancelWorker() {
//     // while ( yield take('START_BACKGROUND_SYNC') ) {
//         // starts the task in the background
//         const bgSyncTask = yield fork(bgSync)

//         // wait for the user stop action
//         // yield take('STOP_BACKGROUND_SYNC')
//         // user clicked stop. cancel the background task
//         // this will cause the forked bgSync task to jump into its finally block
//         yield cancel(bgSyncTask)
//     // }
// }


///////////////////////////////
export function* loadPosts() {
    // throw new Error(); //fork and spawn
    const posts = yield call(getData, 'posts' );
    console.log('load posts',posts);
    return posts;
}

export function* loadComments() {
  const comments = yield call(getData, 'comments');
  console.log('load comments', comments);
  return comments;
}
function* loadComments() {
    try {
        const comments = yield call(getData, 'comments' );
        console.log('load comments', comments);
        yield put(setComments(comments));
        // console.log('select effect', yield select());
        console.log('select effect', yield select(store=>store.reducerInfo.comments)); //select
        // console.log(comments);
    } finally { //cancelled
        if (yield cancelled()) {
            console.log('task was canceled');
        }
    }
}

function* forkWorker() { //fork and call
        console.log("run parallel tasks");
        yield fork(loadPosts);
        const comments = yield fork(loadComments);
        console.log("fininsh parallel tasks");
        yield take(actionTypes.CANCEL);
        yield cancel(comments); //cancel
}

// export function* forkWorker() { //join
//     console.log("run parallel tasks");
//     const task = yield fork(loadPosts);
//     yield spawn(loadComments);
//     const posts = yield join(task) //блокирует неблокирующую задачу и получает ее результат
//     console.log("fininsh parallel tasks", posts);
// }

//////////////////////////////////

function* takeWorker() {
  const comments = yield call(getData, 'comments');
  console.log('LOADED', comments);
}
  function* changeUsername(action) {
    console.log('username', action.payload.username)
    yield call(saveName, action.payload.username)
  }
  
  export function* throttleDebounceWatcher() { //throttle and debounce
    yield throttle(4000, actionTypes.CHANGE_USERNAME, changeUsername); //будет вызываться одно действие в течении n-секунд
    // yield debounce(2000, actionTypes.CHANGE_USERNAME, changeUsername); //ожидает окончания ввода(действия) и n-секунд
  }
  
  export function* takeWatcher() {
    yield takeEvery(actionTypes.PUT, takeWorker1);
  }
  
  function* allWorker() { //all as array
    const [] = yield all([
      console.log('Start'),
      yield call(loadPosts),
      console.log('First rosponse'),
      yield delay(2000),
      yield call(loadComments),
      console.log('Finish'),
    ]);
  }

// function* allWorker() {    //all effect as object
//   const {posts, comments} = yield all({
//     posts: call(loadPosts),
//     comments: yield call(loadComments),
//   });
//   yield put(setPosts(posts));
//   console.log(posts,' posts');
//   console.log(comments,' comments');
// }


function* raceWorker() {
  const [] = yield race([
    call(loadPosts),
    // yield delay(3000),
    call(loadComments),
  ])
}

export function* forkWatcher() {
    yield takeEvery(actionTypes.FORK, forkWorker);
}

export function* applyWatcher() {
    yield takeEvery(actionTypes.APPLY, applyWorker);
}

// export function* cancelWatcher() {
//     yield takeEvery(actionTypes.CANCEL, cancelWorker);
// }


/////////////////////////////////////////////////////////////// TAKE EFFECTS

export function* takeWatcher() {
  // while(true) { //uncomment for repeat generator
    yield take(actionTypes.TAKE);
    yield takeWorker();
  // }
}

// const checkGenerator = takeWatcher(); //Generator checking
// console.log(checkGenerator.next(),'generator');
// console.log(checkGenerator.next(),'generator');
// console.log(checkGenerator.next(),'generator');

export function* takeLatestWatcher() {
  yield takeLatest(actionTypes.TAKE_LATEST, takeWorker);
}

export function* takeLeadingWatcher() {
  yield takeLeading(actionTypes.TAKE_LEADING, takeWorker);
}

export function* takeEveryWatcher() {
  yield takeEvery(actionTypes.TAKE_EVERY, takeWorker);
}

//////////////////////////////////////////////////////////// ALL / RACE EFFECTS

export function* allWatcher() {
  yield takeEvery(actionTypes.ALL, allWorker);
}

export function* raceWatcher() {
  yield takeEvery(actionTypes.RACE, raceWorker);
}