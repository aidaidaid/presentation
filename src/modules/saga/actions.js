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

export const actionTypes = {
    GET_POSTS: 'GET_POSTS',
    PUT: 'PUT',
    PUT_RESOLVE: 'PUT_RESOLVE',
    FORK: 'FORK',
    APPLY: 'APPLY',
}
