import { types } from "./actionTypes";

export const setPosts = (payload) => ({
    type: types.SET_POSTS,
    payload
});

export const setComments = (payload) => ({
    type: types.SET_COMMENTS,
    payload
});