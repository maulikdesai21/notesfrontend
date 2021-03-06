import { Editor } from "slate-react";
import { Value } from "slate";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import TagsInput from "react-tagsinput";

import "react-tagsinput/react-tagsinput.css";
import { isKeyHotkey } from "is-hotkey";
import { Button, Toolbar } from "../../common/components/controls";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import Plain from "slate-plain-serializer";

const DEFAULT_NODE = "paragraph";
const defaultText = {
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            leaves: [
              {
                text: "A line of text in a paragraph."
              }
            ]
          }
        ]
      }
    ]
  }
};

const isBoldHotkey = isKeyHotkey("mod+b");
const isItalicHotkey = isKeyHotkey("mod+i");
const isUnderlinedHotkey = isKeyHotkey("mod+u");
const isCodeHotkey = isKeyHotkey("mod+`");

class RichTextEditor extends React.Component {
  state = {
    value: Value.fromJSON(
      this.props.note ? this.props.note.richText : defaultText
    ),
    tags: this.props.note ? this.props.note.tags : []
  };

  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type === type);
  };

  hasBlock = type => {
    const { value } = this.state;
    return value.blocks.some(node => node.type === type);
  };
  save = () => {
    const { value, tags } = this.state;
    const {
      saveNoteLocalStorage,
      dispatch,
      currentWorkingNote,
      user,
      saveNoteToDataBase
    } = this.props;

    const { token } = user;
    if (token) {
      dispatch(
        saveNoteToDataBase({
          noteType: "RICH_TEXT",
          richText: value.toJSON(),
          tags,
          id: currentWorkingNote,
          plainText: Plain.serialize(value),
          token
        })
      );
    } else {
      dispatch(
        saveNoteLocalStorage({
          noteType: "RICH_TEXT",
          richText: value.toJSON(),
          tags,
          id: currentWorkingNote,
          plainText: Plain.serialize(value)
        })
      );
    }
  };
  delete = () => {
    const {
      deleteNoteFromLocalStorage,
      dispatch,
      currentWorkingNote,
      user,
      deleteNoteFromDataBase
    } = this.props;
    const { token } = user;

    if (token) {
      dispatch(deleteNoteFromDataBase(currentWorkingNote, token));
    } else {
      dispatch(deleteNoteFromLocalStorage(currentWorkingNote));
    }
  };

  handleChange = tags => {
    this.setState({ tags });
  };

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (prevProps.currentWorkingNote !== this.props.currentWorkingNote) {
      if (!this.props.currentWorkingNote) {
        this.setState({
          value: Value.fromJSON(defaultText),
          tags: []
        });
      } else {
        this.setState({
          value: Value.fromJSON(this.props.note.richText),
          tags: this.props.note.tags
        });
      }
    }
  }

  render() {
    return (
      <div>
        <Toolbar>
          <div className="displayFlex FlexSpaceBetween">
            <div>
              {this.renderMarkButton("bold", "format_bold")}
              {this.renderMarkButton("italic", "format_italic")}
              {this.renderMarkButton("underlined", "format_underlined")}
              {this.renderMarkButton("code", "code")}
              {this.renderBlockButton("heading-one", "looks_one")}
              {this.renderBlockButton("heading-two", "looks_two")}
              {this.renderBlockButton("block-quote", "format_quote")}
              {this.renderBlockButton("numbered-list", "format_list_numbered")}
              {this.renderBlockButton("bulleted-list", "format_list_bulleted")}
            </div>
            <div className="tagEditor">
              <TagsInput value={this.state.tags} onChange={this.handleChange} />
            </div>
            <div>
              <IconButton onClick={this.delete} aria-label="Delete">
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={this.save} aria-label="Save">
                <SaveIcon />
              </IconButton>
            </div>
          </div>
        </Toolbar>
        <Editor
          spellCheck
          autoFocus
          placeholder="Enter some rich text..."
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
        />
      </div>
    );
  }

  renderMarkButton = (type, icon) => {
    const { classes } = this.props;
    const isActive = this.hasMark(type);

    return (
      <Button
        active={isActive}
        className="spaceOut"
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon className={classes.icon}>{icon}</Icon>
      </Button>
    );
  };

  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type);

    if (["numbered-list", "bulleted-list"].includes(type)) {
      const { value } = this.state;
      const parent = value.document.getParent(value.blocks.first().key);
      isActive = this.hasBlock("list-item") && parent && parent.type === type;
    }

    return (
      <Button
        active={isActive}
        className="spaceOut"
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    );
  };

  renderNode = props => {
    const { attributes, children, node } = props;

    switch (node.type) {
      case "block-quote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "heading-one":
        return <h1 {...attributes}>{children}</h1>;
      case "heading-two":
        return <h2 {...attributes}>{children}</h2>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      default: {
        return <span>{children}</span>;
      }
    }
  };

  renderMark = props => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case "bold":
        return <strong {...attributes}>{children}</strong>;
      case "code":
        return <code {...attributes}>{children}</code>;
      case "italic":
        return <em {...attributes}>{children}</em>;
      case "underlined":
        return <u {...attributes}>{children}</u>;
      default: {
        return <span>{children}</span>;
      }
    }
  };

  onChange = ({ value }) => {
    this.setState({ value });
  };

  onKeyDown = (event, change) => {
    let mark;

    if (isBoldHotkey(event)) {
      mark = "bold";
    } else if (isItalicHotkey(event)) {
      mark = "italic";
    } else if (isUnderlinedHotkey(event)) {
      mark = "underlined";
    } else if (isCodeHotkey(event)) {
      mark = "code";
    } else {
      return;
    }

    event.preventDefault();
    change.toggleMark(mark);
    return true;
  };

  onClickMark = (event, type) => {
    event.preventDefault();
    const { value } = this.state;
    const change = value.change().toggleMark(type);
    this.onChange(change);
  };

  onClickBlock = (event, type) => {
    event.preventDefault();
    const { value } = this.state;
    const change = value.change();
    const { document } = value;

    // Handle everything but list buttons.
    if (type !== "bulleted-list" && type !== "numbered-list") {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock("list-item");

      if (isList) {
        change
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else {
        change.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock("list-item");
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type);
      });

      if (isList && isType) {
        change
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else if (isList) {
        change
          .unwrapBlock(
            type === "bulleted-list" ? "numbered-list" : "bulleted-list"
          )
          .wrapBlock(type);
      } else {
        change.setBlocks("list-item").wrapBlock(type);
      }
    }

    this.onChange(change);
  };
}

export default withStyles({})(RichTextEditor);
