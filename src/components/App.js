import React, { Component } from "react";
import "./App.css";
import { connect } from "react-redux";
import ResponsiveDrawer from "../common/components/ResponsiveDrawer";
import { withStyles } from "@material-ui/core/styles";
import LeftNav from "./LeftNav";
import compose from "recompose/compose";
import Editor from "./Editor";
import {
  createNewNote,
  authenticateUser,
  authenticationErrorAck
} from "./Redux/Actions";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Fade from "@material-ui/core/Fade";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}
const styles = theme => ({
  paper: {
    position: "absolute",
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  }
});

class App extends Component {
  state = {
    open: false,
    userName: "",
    password: ""
  };
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  openModal = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({
      open: false,
      userName: "",
      password: ""
    });
  };
  createNewNote = () => {
    const { dispatch } = this.props;
    dispatch(createNewNote());
  };
  handleCloseAuth = () => {
    const { dispatch } = this.props;
    dispatch(authenticationErrorAck());
  };
  login = () => {
    const { userName, password } = this.state;
    const { dispatch } = this.props;
    if (userName && password) {
      dispatch(authenticateUser(userName, password));
      this.handleClose();
    }
  };
  render() {
    const { classes, notes, user } = this.props;
    const { name, token, authenticationError, authenticating } = user;
    return (
      <div>
        <ResponsiveDrawer
          openModal={this.openModal}
          handleClose={this.handleClose}
          createNewNote={this.createNewNote}
          LeftNav={LeftNav}
          Editor={Editor}
        />
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="title" id="modal-title">
              Login
            </Typography>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="userName"
                label="User Name"
                className={classes.textField}
                value={this.state.userName}
                onChange={this.handleChange("userName")}
                margin="normal"
              />
              <TextField
                id="Password"
                label="Password"
                className={classes.textField}
                value={this.state.password}
                onChange={this.handleChange("password")}
                type="password"
                autoComplete="current-password"
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={this.login}
                className={classes.button}
              >
                Login
              </Button>
            </form>
          </div>
        </Modal>
        <Snackbar
          open={authenticationError}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={this.handleCloseAuth}
          TransitionComponent={Fade}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id"> Authentication Failed</span>}
        />
      </div>
    );
  }
}
export default compose(
  withStyles(styles),
  connect(state => ({
    notes: state.notes,
    user: state.user
  }))
)(App);
