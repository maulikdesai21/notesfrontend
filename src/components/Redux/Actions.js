import CONFIG from "../../settings/env";
import axios from "axios";

export const SAVE_NOTE_LOCAL_STORAGE = "SAVE_NOTE_LOCAL_STORAGE";
export const DELETE_NOTE_FROM_LOCAL_STORAGE = "DELETE_NOTE_FROM_LOCAL_STORAGE";
export const FILTER_NOTES = "FILTER_NOTES";
export const CREATE_NEW_NOTE = "CREATE_NEW_NOTE";
export const MAKE_NOTE_ACTIVE = "MAKE_NOTE_ACTIVE";
export const AUTHENTICATION_SUCCESS = "AUTHENTICATION_SUCCESS";
export const AUTHENTICATING_USER = "AUTHENTICATING_USER";
export const AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR";
export const AUTHENTICATION_ERROR_ACK = "AUTHENTICATION_ERROR_ACK";
export const LOGOUT_USER = "LOGOUT_USER";
export const MERGE_NOTES = "MERGE_NOTES";
export const SAVE_NOTE_TO_DATABASE = "SAVE_NOTE_TO_DATABASE";
export const UPDATE_NOTE_IN_DATABASE = "UPDATE_NOTE_IN_DATABASE";
export const DELETE_NOTE_FROM_DATABASE = "DELETE_NOTE_FROM_DATABASE";
export function saveNoteToDataBase({
  id,
  tags,
  user,
  noteType,
  plainText,
  richText,
  token
}) {
  return async dispatch => {
    try{
      if (!id) {
        let postData = {
          noteType,
          plainText,
          richText,
          tags
        };
        const { data } = await axios.post(
          `${CONFIG.notesBackend}api/v1/notes/`,
          postData,
          {
            headers: { Authorization: "Bearer " + token }
          }
        );
        dispatch({
          type: SAVE_NOTE_TO_DATABASE,
          data: {
            ...data,
            richText: JSON.parse(data.richText)
          }
        });
      } else {
        let postData = {
          noteType,
          plainText,
          richText,
          tags,
          id
        };
        const { data } = await axios.put(
          `${CONFIG.notesBackend}api/v1/notes/${id}`,
          postData,
          {
            headers: { Authorization: "Bearer " + token }
          }
        );
        dispatch({
          type: UPDATE_NOTE_IN_DATABASE,
          data: {
            ...data,
            richText: JSON.parse(data.richText)
          }
        });
      }
    }catch(err){
      console.log(err);
    }

  };
}
export function saveNoteLocalStorage({
  id,
  tags,
  user,
  noteType,
  plainText,
  richText
}) {
  return {
    type: SAVE_NOTE_LOCAL_STORAGE,
    data: {
      id: id ? id : new Date().getTime(),
      tags: tags,
      user,
      noteType,
      plainText,
      richText,
      lastUpdated: new Date()
    }
  };
}

export function deleteNoteFromDataBase(id,token){
  return async dispatch => {
    try{
      await  axios.delete(
        `${CONFIG.notesBackend}api/v1/notes/${id}`,  
        {
          headers: { Authorization: "Bearer " + token }
        }
      );
      return {
        type: DELETE_NOTE_FROM_DATABASE,
        data: {
          id
        }
      }
    }catch(err){
      console.log(err);
    }
    
  }
}
export function deleteNoteFromLocalStorage(id) {
  return {
    type: DELETE_NOTE_FROM_LOCAL_STORAGE,
    data: {
      id
    }
  };
}
export function filterNotes(ids) {
  return {
    type: FILTER_NOTES,
    data: {
      ids
    }
  };
}

export function createNewNote() {
  return {
    type: CREATE_NEW_NOTE,
    data: {
      currentWorkingNote: null
    }
  };
}

export function makeNoteActive(id) {
  return {
    type: MAKE_NOTE_ACTIVE,
    data: {
      currentWorkingNote: id
    }
  };
}

export function authenticateUser(userName, password) {
  return async dispatch => {
    try {
      dispatch({
        type: AUTHENTICATING_USER,
        data: {
          authenticating: true
        }
      });
      const postData = {
        userName,
        password
      };
      const { data } = await axios.post(
        `${CONFIG.notesBackend}authenticate`,
        postData
      );
      dispatch({
        type: AUTHENTICATION_SUCCESS,
        data: {
          authenticationError: false,
          authenticating: false,
          name: data.name,
          token: data.token
        }
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: AUTHENTICATION_ERROR,
        data: {
          authenticationError: true,
          authenticating: false
        }
      });
    }
  };
}
export function authenticationErrorAck() {
  return {
    type: AUTHENTICATION_ERROR_ACK,
    data: {
      authenticationError: false
    }
  };
}
export function logoutUser() {
  return {
    type: LOGOUT_USER,
    data: {
      authenticationError: false,
      authenticating: false,
      name: "",
      token: ""
    }
  };
}

export function postLoadNotesToServer({
  notes,
  localNotes,
  serverNotes,
  sortedNoteId,
  isFetching,
  currentWorkingNote,
  tags,
  token
}) {
  return async dispatch => {
    let postData = [];

    for (let noteId of localNotes) {
      postData.push(notes[noteId]);
    }
    try {
      const { data } = await axios.post(
        `${CONFIG.notesBackend}api/v1/notes/notes/postNotes`,
        postData,
        {
          headers: { Authorization: "Bearer " + token }
        }
      );
      let noteMap = {};
      for (let note of data) {
        let richText = note.richText;
        note.richText = JSON.parse(richText);
        note.id = note._id;
        delete note["_id"];
        noteMap[note.id] = note;
      }
      dispatch({
        type: MERGE_NOTES,
        data: {
          notes: noteMap
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
}
