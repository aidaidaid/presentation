import { types } from "./actionTypes";

const initialState = {
    posts: [],
    comments: [],
    filesUploading: 0
};

function reducerInfo (state = initialState, action) {
    switch(action.type) {
        case types.SET_POSTS:
            console.log(action.payload, 'weqwewqxcxxczxczcz');
            return{
                ...state,
                posts: action.payload,
            }
        case types.SET_COMMENTS:
            return{
                ...state,
                comments: action.payload,
            }
        case types.SET_UPLOADING:
            return{
                ...state,
                filesUploading: action.payload,
            }
        default:
            return state;
    };
};

export default reducerInfo;