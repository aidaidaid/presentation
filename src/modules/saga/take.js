import { act } from 'react-dom/cjs/react-dom-test-utils.production.min';
import { takeEvery, call, apply, put, delay, putResolve, select, fork, spawn, join, throttle, debounce } from 'redux-saga/effects';
import { saveName } from '../api/user';
import { setComments, setPosts } from '../redux/actions';
import { actionTypes } from './actions';

const delayFN = (t, url) => {
    setTimeout(() => {
        console.log('with timeout')
        const response = fetch(`https://jsonplaceholder.typicode.com/${url}`).then(res => res.json()).catch(e => console.warn("getData", e));
        return response;
    }, t);
}

const getData = async(url) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/${url}`).then(res => res.json()).catch(e => console.warn("getData", e));
    return response;    
};

const fetchSmth = result => dispatch =>
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

function* takeWorker1() {
    try {
        const result = yield call(getData, `posts`);
        // const result = yield call(delayFN, 1000, 'posts' );
        // if(actionTypes.PUT){
        yield put(setPosts(result));
            // yield put(fetchSmth(result));
            console.log("state after PUT", yield select());
        // }
        // else if(actionTypes.PUT_RESOLVE){
        //     yield putResolve(fetchSmth(result));
        //     console.log("state after PUT_RESOLVE", yield select());
        // }
        // yield put(setPosts(result)); //вызывает dispatch
        console.log(result)
        
    }
    catch (error) {
        console.warn(error);
    }
}

function* takeWorker2() {
    try {
        const result = yield call(getData, `https://jsonplaceholder.typicode.com/posts`);
        // const result = yield fork(delayFN, 2000, 'posts' );
        // if(actionTypes.PUT){
        //     yield put(fetchSmth(result));
        //     console.log("state after PUT", yield select());
        // }
        // else if(actionTypes.PUT_RESOLVE){
            yield putResolve(fetchSmth(result));
            console.log("state after PUT_RESOLVE", yield select());
        // }
        // yield put(setPosts(result));
        console.log(result)
        
    }
    catch (error) {
        console.warn(error);
    }
}


///////////////////////////////
function* loadPosts() {
    // throw new Error(); //fork and spawn
    const posts = yield call(getData, 'posts' );
    console.log('load posts',posts);
    // console.log(posts);
    return posts;
}

function* loadComments() {
    const comments = yield call(getData, 'comments' );
    console.log('load comments', comments);
    yield put(setComments(comments));
    // console.log('select effect', yield select());
    console.log('select effect', yield select(store=>store.reducerInfo.comments)); //select
    // console.log(comments);
}

function* forkWorker() { //fork and call
    console.log("run parallel tasks");
    yield fork(loadPosts);
    yield fork(loadComments);
    console.log("fininsh parallel tasks");
}

// export function* forkWorker() { //join
//     console.log("run parallel tasks");
//     const task = yield fork(loadPosts);
//     yield spawn(loadComments);
//     const posts = yield join(task) //блокирует неблокирующую задачу и получает ее результат
//     console.log("fininsh parallel tasks", posts);
// }
//////////////////////////////////

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

export function* takeWatcher1() {
    yield takeEvery(actionTypes.PUT_RESOLVE, takeWorker2);
}

export function* forkWatcher() {
    yield takeEvery(actionTypes.FORK, forkWorker);
}

export function* applyWatcher() {
    yield takeEvery(actionTypes.APPLY, applyWorker);
}


// export function* allWatcher() {
//     yield takeEvery(actionTypes.PUT_RESOLVE, allWorker);
// }