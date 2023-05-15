import {userReducer} from "./userReducer";
import { combineReducers } from "redux";
import { searchReducer } from "./searchReducer";

const rootReducer = combineReducers({
    user : userReducer,
    search: searchReducer,
});

export default rootReducer;