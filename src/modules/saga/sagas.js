import { buffers, channel, END, eventChannel } from 'redux-saga';
import { takeEvery, call, apply, put, delay, putResolve, select, fork, spawn, join, throttle, debounce, cancelled, cancel, take, all, race, takeLeading, takeLatest, actionChannel} from 'redux-saga/effects';
import { createEventProvider } from '../api/event-provider';
import { uploadFile } from '../api/file-uploading';
import { saveName } from '../api/user';
import { setComments, setPosts, setUploading } from '../redux/actions';
import { actionTypes } from './actionTypes';
import {SagaMonitor} from 'redux-saga'


const getData = async(url) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/${url}`).then(res => res.json()).catch(e => console.warn("getData", e));
  return response;    
};

/////////////////////////////////////
function* applyWorker() { //apply и call с контекстом
  const fetchWithApplyFN = () => {
    return {
      getUrl(id) {
        return `https://jsonplaceholder.typicode.com/posts/${id}`
      },
      getPosts(id, effectName) {
        console.log(effectName);
        return fetch(this.getUrl(id)).then((response) => response.json());
      },
    }
  }
  
  const fetchWithApply = fetchWithApplyFN();
  const post = yield apply(fetchWithApply, fetchWithApply.getPosts, [5, 'apply with context']);
  // const post = yield call([fetchWithApply, fetchWithApply.getPosts], 5, 'call with context');
  // const post = yield call(fetchWithApply.getPosts, 5, 'call without context'); //TypeError: Cannot read properties of null (reading 'getUrl')
  console.log(post);
}

///////////////////////////////
export function* loadPosts() {
  // throw new Error(); //fork and spawn
  const posts = yield call(getData, 'posts' );
  console.log('load posts',posts);
  return posts;
}

// export function* loadComments() { //tima
//   const comments = yield call(getData, 'comments');
//   console.log('load comments', comments);
//   return comments;
// }

function* loadComments() {
  try {
    const comments = yield call(getData, 'comments' );
    console.log('load comments', comments);
    yield put(setComments(comments));
    // console.log('select effect', yield select());
    console.log('select effect', yield select(store=>store.comments)); //select
    // console.log(comments);
  } finally { //cancelled
      if (yield cancelled()) {
        console.log('task was canceled');
      }
  }
}

function* forkWorker() { //fork and call
  console.log("run parallel tasks");
  yield fork(loadPosts); //call, spawn
  const comments = yield fork(loadComments);
  console.log("fininsh parallel tasks");
  yield take(actionTypes.CANCEL);
  yield cancel(comments); //cancel - task должен быть не блокирующим
}

// function* forkWorker() { //join
//   console.log("run parallel tasks");
//   const task = yield fork(loadPosts);
//   yield spawn(loadComments);
//   const posts = yield join(task) //блокирует неблокирующую задачу и получает ее результат
//   console.log("join result:", posts);
//   console.log("fininsh parallel tasks");
// }

//////////////////////////////////

function* changeUsername(action) {
  console.log('username', action.payload.username)
  yield call(saveName, action.payload.username) //имитация работы с сервером
}

export function* throttleDebounceWatcher() { //throttle and debounce - каждое изменение поля будет диспатчить экшн с новыи значением
  // yield throttle(2000, actionTypes.CHANGE_USERNAME, changeUsername); //будет вызываться одно действие в течении n-секунд
  yield debounce(2000, actionTypes.CHANGE_USERNAME, changeUsername); //отменяет предыдущие действия / ожидает окончания ввода и n-секунд
}

export function* forkWatcher() {
  yield takeEvery(actionTypes.FORK, forkWorker);
}

export function* applyWatcher() {
  yield takeEvery(actionTypes.APPLY, applyWorker);
}

/////////////////////////ALL AND RACE////////////////////////////////////

function* takeWorker() {
  const comments = yield call(getData, 'comments');
  console.log('LOADED', comments);
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



/////////////////////// CHANNELS ////////////////////////////////

/////////////////////// Channel ///////////////////

const handleProgress = (fileUploadingChannel, progressValue) => {
  fileUploadingChannel.put({ //кидает сообщения в канал
    value: progressValue,
  })
}

function* channelWorker(fileUploadingChannel) {
  while (true) {
    const payload = yield take(fileUploadingChannel)
    yield put(setUploading(payload.value))
  }
}

export function* channelWatcher() {
  const fileUploadingChannel = yield call(channel)
  yield fork(channelWorker, fileUploadingChannel) //channelWorker ловит сообщения и диспатчит новый экшн в стор для обновления прогресса

  while (true) {
    yield take(actionTypes.CHANNEL)
    yield fork(uploadFile, {
      url: 'https://server',
      files: ['file1', 'file2'],
      onProgress: (progressValue) =>
        handleProgress(fileUploadingChannel, progressValue),
    })
  }
}

/////////////////////// Action Channel ///////////////////

function* actionChannelWorker(action) {
  console.log(`Processing action: ${action.payload.id}`);
  yield call(loadPosts);
}

export function* actionChannelWatcher() {
  const requestChannel = yield actionChannel(actionTypes.ACTION_CHANNEL,
    // buffers.none() // no buffering, new messages will be lost if there are no pending takers
    // buffers.fixed(2) // new messages will be buffered up to limit, overflow will raise an Error
    // buffers.expanding(2) // like fixed but Overflow will cause the buffer to expand dynamically
    buffers.dropping(2) // same as fixed but Overflow will silently drop the messages
    // buffers.sliding(2) // same as fixed but Overflow will insert the new message at the end and drop the oldest message in the buffer
  );
  while (true) {
    const action = yield take(requestChannel);
    yield call(actionChannelWorker, action); //должен быть блокирующим
  }
}

/////////////////////// Event Channel ///////////////////

const createEventProviderChannel = (eventProvider) => {
  return eventChannel((emitter) => { //принимает функцию инициализации соединения со сторонним источником событий
    const valueHandler = (event) => {
      if (event.payload > 5) {
        emitter(END) //закрытие канала, переход в блок finally, отписка от событий
        return
      }
      emitter(event.payload) //соединяем сторонний провайдер событий с сагой, отправка события в канал
    }
    eventProvider.subscribe('value', valueHandler)
    return () => {
      eventProvider.unsubscribe('value', valueHandler)
      console.log('unsubscribed')
    }
  })
}

function* eventChannelWorker() {
  const eventProvider = yield call(createEventProvider);
  const eventProviderChannel = yield call(createEventProviderChannel, eventProvider);

  try {
    while (true) { //прослушиваем события из канала, как только какое-то событие поступит в eventProviderChannel, take его ловит
      const payload = yield take(eventProviderChannel);
      console.log('payload from event channel', payload);
    }
  } catch (error) {
    console.log('error', error);
  } finally {
    console.log('event channel terminated');
  }
}

export function* eventChannelWatcher() {
  yield takeEvery(actionTypes.EVENT_CHANNEL, eventChannelWorker);
}

/////////////////////////////////WATCHERS//////////////////////////////////

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

// //////////////////////////////////////////////////////////// ALL / RACE EFFECTS
//
export function* allWatcher() {
  yield takeEvery(actionTypes.ALL, allWorker);
}

export function* raceWatcher() {
  yield takeEvery(actionTypes.RACE, raceWorker);
}