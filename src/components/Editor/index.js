import React from "react";
import RichTextEditor from "./RichTextEditor";
import { connect } from "react-redux";
import { saveNoteLocalStorage,deleteNoteFromLocalStorage,saveNoteToDataBase,deleteNoteFromDataBase } from "../Redux/Actions";

import "./Editor.css";
class Editor extends React.Component {
  render() {
    const { currentWorkingNote, notes } = this.props.notes;
    const note = notes[currentWorkingNote];
    return (
      <div>
        <RichTextEditor
          saveNoteLocalStorage={saveNoteLocalStorage}
          dispatch={this.props.dispatch}
          note={note}
          currentWorkingNote={currentWorkingNote}
          deleteNoteFromLocalStorage = {deleteNoteFromLocalStorage}
          user={this.props.user}
          saveNoteToDataBase={saveNoteToDataBase}
          deleteNoteFromDataBase={deleteNoteFromDataBase}
        />
      </div>
    );
  }
}

export default connect(state => ({
  notes: state.notes,
  user:state.user
}))(Editor);
