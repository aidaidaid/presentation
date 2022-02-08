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

export const actionTypes = {
    GET_POSTS: 'GET_POSTS',
    PUT: 'PUT',
    PUT_RESOLVE: 'PUT_RESOLVE',
    FORK: 'FORK',
    APPLY: 'APPLY',
    TAKE:'TAKE',
    TAKE_LEADING: 'TAKE_LEADING',
    TAKE_LATEST: 'TAKE_LATEST',
    TAKE_EVERY: 'TAKE_EVERY',
    ALL: 'ALL',
    RACE: 'RACE',
    CHANGE_USERNAME: 'CHANGE_USERNAME',
    CANCEL: 'CANCEL'
}
