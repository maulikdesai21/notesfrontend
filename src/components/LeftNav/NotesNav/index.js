// This file is shared across the demos.

import React from "react";
import ListItem from "@material-ui/core/ListItem";
import { connect } from "react-redux";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SendIcon from "@material-ui/icons/Send";
import ClassIcon from "@material-ui/icons/Class";
import {makeNoteActive} from "../../Redux/Actions";



class NotesNav extends React.Component {
 
  selectNote = (id)=>{
    const {dispatch} = this.props;
    if(id){
      dispatch(makeNoteActive(id))
    }
  }

  render() {
    let { notes, sortedNoteId } = this.props.notes;
    if(sortedNoteId.length ===0){
      sortedNoteId = Object.keys(notes);
    }
    return (
      <div>
        {sortedNoteId.length > 0 &&
          sortedNoteId.map((noteId,index) => {
            let note = notes[noteId]
            let title = note.plainText.substring(0,30)+"....";
            
            return (
              <ListItem key={index}  onClick={(note) => { this.selectNote(noteId)}} button>
                <ListItemIcon>
                  <SendIcon />
                </ListItemIcon>
                <ListItemText inset primary={title} />
              </ListItem>
            );
          })}
          {sortedNoteId.length === 0 &&
            <div className="placeHolderContainer">
                <ClassIcon  className="placeHolderIcon"/>
                <p style={{fontSize:16,textAlign:"center"}}>
                   Add Notes by using the + sign on Top Right
                </p>
                <p>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget 
                </p>

            </div>
          }
      </div>
    );
  }
}

export default connect(state => ({
  notes: state.notes
}))(NotesNav);
