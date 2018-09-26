import {
  SAVE_NOTE_LOCAL_STORAGE,
  DELETE_NOTE_FROM_LOCAL_STORAGE,
  FILTER_NOTES,
  CREATE_NEW_NOTE,
  MAKE_NOTE_ACTIVE,
  AUTHENTICATION_ERROR,
  AUTHENTICATING_USER,
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_ERROR_ACK,
  LOGOUT_USER,
  MERGE_NOTES,
  SAVE_NOTE_TO_DATABASE,
  UPDATE_NOTE_IN_DATABASE,
  DELETE_NOTE_FROM_DATABASE
} from "./Actions";

function createTagMap(serverNotes) {
  let tagMap = {};
  for (let key of Object.keys(serverNotes)) {
    let note = serverNotes[key];
    tagMap = addIdToTagMap(tagMap, note.tags, note.id);
  }
  return tagMap;
}
function addIdToTagMap(OldMap, tags, id) {
  let tagMap = OldMap;
  for (let tagId in tagMap) {
    let tag = tagMap[tagId];
    if (!tags.includes(tagId) && tag.includes(id)) {
      if (tag.length === 1) {
        delete tagMap[tagId];
      } else {
        let index = tag.indexOf(tagId);
        if (index > -1) {
          tagMap.splice(index, 1);
        }
      }
    }
    if (tags.includes(tagId) && !tag.includes(id)) {
      tag.push(id);
      let index = tags.indexOf(tagId);
      if (index > -1) {
        tags.splice(index, 1);
      }
    } else if (tags.includes(tagId) && tag.includes(id)) {
      let index = tags.indexOf(tagId);
      if (index > -1) {
        tags.splice(index, 1);
      }
    }
  }
  if (tags.length > 0) {
    for (let tag of tags) {
      tagMap[tag] = [id];
    }
  }
  return tagMap;
}
function removeIdFromMap(OldMap, id) {
  debugger;
  let tagMap = OldMap;
  for (let tagId in tagMap) {
    let tag = tagMap[tagId];
    if (tag.includes(id)) {
      if (tag.length === 1) {
        delete tagMap[`${tagId}`];
      } else {
        let index = tagMap[tagId].indexOf(id);
        if (index > -1) {
          tagMap[tagId].splice(index, 1);
        }
      }
    }
  }
  return tagMap;
}

export function notes(
  state = {
    notes: {},
    localNotes: [],
    serverNotes: [],
    sortedNoteId: [],
    isFetching: false,
    currentWorkingNote: null,
    tags: {}
  },
  action
) {
  switch (action.type) {
    case UPDATE_NOTE_IN_DATABASE: {
      const tempNotes = state.notes;
      const tempServerNotes = state.serverNotes;
      const docTags = [...action.data.tags];

      tempNotes[action.data._id] = action.data;
      if (!tempServerNotes.includes(action.data._id)) {
        tempServerNotes.push(action.data._id);
      }
      return {
        ...state,
        notes: tempNotes,
        serverNotes: tempServerNotes,
        currentWorkingNote: action.data._id,
        tags: addIdToTagMap(state.tags, docTags, action.data._id)
      };
    }
    case SAVE_NOTE_TO_DATABASE: {
      const tempNotes = state.notes;
      const tempServerNotes = state.serverNotes;
      const docTags = [...action.data.tags];

      tempNotes[action.data._id] = action.data;
      if (!tempServerNotes.includes(action.data._id)) {
        tempServerNotes.push(action.data._id);
      }
      return {
        ...state,
        notes: tempNotes,
        serverNotes: tempServerNotes,
        currentWorkingNote: action.data._id,
        tags: addIdToTagMap(state.tags, docTags, action.data._id)
      };
    }
    case SAVE_NOTE_LOCAL_STORAGE: {
      const tempNotes = state.notes;
      const tempLocalNotes = state.localNotes;
      const docTags = [...action.data.tags];

      tempNotes[action.data.id] = action.data;
      if (!tempLocalNotes.includes(action.data.id)) {
        tempLocalNotes.push(action.data.id);
      }
      return {
        ...state,
        notes: tempNotes,
        localNotes: tempLocalNotes,
        currentWorkingNote: action.data.id,
        tags: addIdToTagMap(state.tags, docTags, action.data.id)
      };
    }
    case DELETE_NOTE_FROM_DATABASE: {
      const tempNotes = state.notes;
      const tempServerNotes = state.serverNotes;
      delete tempNotes[action.data.id];

      let index = tempServerNotes.indexOf(action.data.id);
      if (index > -1) {
        tempServerNotes.splice(index, 1);
      }
      let index2 = state.sortedNoteId.indexOf(action.data.id);
      if (index2 > -1) {
        state.sortedNoteId.splice(index, 1);
      }

      return {
        ...state,
        notes: tempNotes,
        localNotes: tempServerNotes,
        currentWorkingNote: null,
        tags: removeIdFromMap(state.tags, parseInt(action.data.id)),
        sortedNoteId: state.sortedNoteId
      };
    }
    case DELETE_NOTE_FROM_LOCAL_STORAGE: {
      const tempNotes = state.notes;
      const tempLocalNotes = state.localNotes;
      delete tempNotes[action.data.id];
      let index = tempLocalNotes.indexOf(action.data.id);
      if (index > -1) {
        tempLocalNotes.splice(index, 1);
      }
      let index2 = state.sortedNoteId.indexOf(action.data.id);
      if (index2 > -1) {
        state.sortedNoteId.splice(index, 1);
      }
      return {
        ...state,
        notes: tempNotes,
        localNotes: tempLocalNotes,
        currentWorkingNote: null,
        tags: removeIdFromMap(state.tags, parseInt(action.data.id)),
        sortedNoteId: state.sortedNoteId
      };
    }
    case FILTER_NOTES: {
      return {
        ...state,
        sortedNoteId: action.data.ids
      };
    }
    case CREATE_NEW_NOTE: {
      return {
        ...state,
        currentWorkingNote: action.data.currentWorkingNote
      };
    }
    case MAKE_NOTE_ACTIVE: {
      return {
        ...state,
        currentWorkingNote: action.data.currentWorkingNote
      };
    }
    case MERGE_NOTES: {
      let serverNotes = action.data.notes;
      return {
        notes: serverNotes,
        localNotes: [],
        serverNotes: Object.keys(serverNotes),
        sortedNoteId: [],
        isFetching: false,
        currentWorkingNote: null,
        tags: createTagMap(serverNotes)
      };
    }
    case LOGOUT_USER: {
      return {
        notes: {},
        localNotes: [],
        serverNotes: [],
        sortedNoteId: [],
        isFetching: false,
        currentWorkingNote: null,
        tags: {}
      };
    }
    default:
      return state;
  }
}

export function user(
  state = {
    name: "",
    token: "",
    authenticationError: false,
    authenticating: false
  },
  action
) {
  switch (action.type) {
    case AUTHENTICATION_ERROR: {
      return {
        ...state,
        ...action.data
      };
    }
    case AUTHENTICATING_USER: {
      return {
        ...state,
        ...action.data
      };
    }
    case AUTHENTICATION_SUCCESS: {
      return {
        ...state,
        ...action.data
      };
    }
    case AUTHENTICATION_ERROR_ACK: {
      return {
        ...state,
        ...action.data
      };
    }
    case LOGOUT_USER: {
      return {
        ...state,
        ...action.data
      };
    }
    default:
      return state;
  }
}
