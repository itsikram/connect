import { SET_HEADER_HEIGHT,SET_BODY_HEIGHT } from "../constants/optionConsts";
let initialState = {headerHeight: null,bodyHeight: null}
const optionReducer = (state=initialState,action) => {
    switch (action.type) {
        case SET_HEADER_HEIGHT:
            return {
                ...state,
                headerHeight: action.payload,
            };
            break;

            case SET_BODY_HEIGHT:
            return {
                ...state,
                bodyHeight: action.payload,
            };
            break;


        default:
            return state;
    }
}

export default optionReducer;