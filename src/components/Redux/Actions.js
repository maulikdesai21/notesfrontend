import CONFIG from '../../settings/env';
import axios from 'axios'

export const SAVE_NOTE_LOCAL_STORAGE = "SAVE_NOTE_LOCAL_STORAGE";
export const DELETE_NOTE_FROM_LOCAL_STORAGE = "DELETE_NOTE_FROM_LOCAL_STORAGE";
export const FILTER_NOTES = 'FILTER_NOTES';
export const CREATE_NEW_NOTE = 'CREATE_NEW_NOTE'
export const MAKE_NOTE_ACTIVE = "MAKE_NOTE_ACTIVE";
export const AUTHENTICATION_SUCCESS ="AUTHENTICATION_SUCCESS";
export const AUTHENTICATING_USER = "AUTHENTICATING_USER";
export const AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR";
export const AUTHENTICATION_ERROR_ACK = 'AUTHENTICATION_ERROR_ACK';
export function saveNoteLocalStorage({id,
  tags,
  user,
  noteType,
  plainText,
  richText
}) {
  return {
    type: SAVE_NOTE_LOCAL_STORAGE,
    data: {
      id:(id)?id : (new Date).getTime(),
      tags:tags,
      user,
      noteType,
      plainText,
      richText,
      lastUpdated:new Date()
    }
  };
}
export function deleteNoteFromLocalStorage(id){
  return {
    type: DELETE_NOTE_FROM_LOCAL_STORAGE,
    data: {
      id
    }
  };
}
export function filterNotes(ids){
  return {
    type:FILTER_NOTES,
    data:{
      ids
    }
  }
}

export function createNewNote(){
  return{
    type:CREATE_NEW_NOTE,
    data:{
      currentWorkingNote:null
    }
  }
}

export function makeNoteActive(id){
  return{
    type:MAKE_NOTE_ACTIVE,
    data:{
      currentWorkingNote:id
    }
  }
}

export function authenticateUser(userName,password){
  return async(dispatch) =>{
    try {
      dispatch({
        type:AUTHENTICATING_USER,
        data:{
          authenticating:true
        }   
      }) 
      const postData = {
        userName,
        password
      };
      const { data } = await axios.post(
        `${CONFIG.notesBackend}authenticate`,
        postData
      );
      dispatch({
        type:AUTHENTICATION_SUCCESS,
        data:{
          authenticationError:false,
          authenticating:false,
          name:data.name,
          token:data.token
        }
      })
    } catch(err) {
        console.log(err);
        dispatch({
          type:AUTHENTICATION_ERROR,
          data:{
            authenticationError:true,
            authenticating:false
          }
        })
    }
  }
}
export function authenticationErrorAck(){
  return{
    type:AUTHENTICATION_ERROR_ACK,
    data:{
      authenticationError:false
    }
  }
}