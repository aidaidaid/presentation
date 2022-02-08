import { act } from 'react-dom/cjs/react-dom-test-utils.production.min';
import { takeEvery, call, put, delay, putResolve, select, fork } from 'redux-saga/effects';
import { setPosts } from '../redux/actions';
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

export function* takeWorker1() {
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
        // yield put(setPosts(result));
        console.log(result)
        
    }
    catch (error) {
        console.warn(error);
    }
}

export function* takeWorker2() {
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
    const posts = yield call(getData, 'posts' );
    console.log('load posts');
    console.log(posts);
}

function* loadComments() {
    const comments = yield call(getData, 'comments' );
    console.log('load comments');
    console.log(comments);
}

export function* forkWorker() { //fork and call
    try {
        console.log("run parallel tasks");
        yield fork(loadPosts);
        yield fork(loadComments);
        console.log("fininsh parallel tasks");
        
    }
    catch (error) {
        console.warn(error);
    }
}
//////////////////////////////////

export function* takeWatcher() {
    yield takeEvery(actionTypes.PUT, takeWorker1);
}

export function* takeWatcher1() {
    yield takeEvery(actionTypes.PUT_RESOLVE, takeWorker2);
}

export function* forkWatcher() {
    yield takeEvery(actionTypes.FORK, forkWorker);
}

// export function* allWatcher() {
//     yield takeEvery(actionTypes.PUT_RESOLVE, allWorker);
// }