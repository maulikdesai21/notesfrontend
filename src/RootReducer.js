import { combineReducers } from 'redux';
import {notes,user} from './components/Redux/Reducers';


const rootReducer = combineReducers({notes,user})

export default rootReducer;