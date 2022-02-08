import { types } from "./actionTypes";

const initialState = {
    posts: []
};

function reducerInfo (state = initialState, action) {
    switch(action.type) {
        case types.SET_POSTS:
            console.log(action.payload, 'weqwewqxcxxczxczcz');
            return{
                ...state,
                posts: action.payload,
            }
        default:
            return state;
    };
};

export default reducerInfo;