import { actionTypes } from "./actionTypes";

export const getPosts = () => ({
    type:actionTypes.GET_POSTS,
});

export const getComments = () => ({
    type:actionTypes.GET_POSTS,
});

export const forkEffect = () => ({
    type:actionTypes.FORK,
});

export const applyEffect = () => ({
    type:actionTypes.APPLY,
});

export const throttleDebounceEffect = () => ({
    type:actionTypes.CHANGE_USERNAME,
});

export const cancelEffect = () => ({
    type:actionTypes.CANCEL,
});

export const takeEffect = () => ({
    type:actionTypes.TAKE,
});

export const takeLeadingEffect = () => ({
    type:actionTypes.TAKE_LEADING,
});

export const takeLatestEffect = () => ({
    type:actionTypes.TAKE_LATEST,
});

export const takeEveryEffect = () => ({
    type:actionTypes.TAKE_EVERY,
});

export const allEffect = () => ({
    type:actionTypes.ALL,
});

export const raceEffect = () => ({
    type:actionTypes.RACE,
});

export const actionChannel = ({ dispatchId }) => {
  console.log(`Received action: USER_POSTS_FETCH_REQUESTED; dispatch id: ${dispatchId}`);
  return {
    type: actionTypes.ACTION_CHANNEL,
    payload: {id: dispatchId },
  }
}

export const eventChannel = () => ({
    type: actionTypes.EVENT_CHANNEL,
});

export const channel = () => ({
    type: actionTypes.CHANNEL,
});
