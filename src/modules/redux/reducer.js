import { types } from "./actionTypes";

const initialState = {
    posts: [],
    comments: []
};

function reducerInfo (state = initialState, action) {
    switch(action.type) {
        case types.SET_POSTS:
            return{
                ...state,
                posts: action.payload,
            }
        case types.SET_COMMENTS:
            return{
                ...state,
                comments: action.payload,
            }
        default:
            return state;
    };
};

export default reducerInfo;