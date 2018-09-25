// This file is shared across the demos.

import React from "react";
import { connect } from "react-redux";
import SortableTree from "react-sortable-tree";
import FileExplorerTheme from "react-sortable-tree-theme-file-explorer";
import Divider from "@material-ui/core/Divider";
import { createMuiTheme } from "@material-ui/core/styles";
import {filterNotes} from '../../Redux/Actions'
class TagNav extends React.Component {
  constructor(props) {
    super(props);
  }
  tagSelected =  ({title})=>{
    const { notes,dispatch } = this.props;
    const { tags } = notes;
    let ids =  tags[title];

    dispatch(filterNotes(ids));
  }

  render() {
    const staticData = {
      treeData: [
        {
          title: "Notes",
          expanded: true,
          children: [
            { title: "UnTagged" },
            { title: "ToDo" },
            { title: "Today" }
          ]
        }
      ]
    };
    const { tags } = this.props.notes;
    let tagsTree = [];
    if (Object.keys(tags).length > 0) {
      for (let tag in tags) {
        tagsTree.push({
          title: tag
        });
      }
    }
  
    const theme = createMuiTheme();
    return (
      <div
        style={{
          height: "100%",
          minHeight: 1000,
          width: "100%",
          backgroundColor: theme.palette.secondary.dark,
          color: theme.palette.text.dark,
          paddingTop: "20px"
        }}
      >
        <div style={{ height: 120 }}>
          <SortableTree
            treeData={staticData.treeData}
            onChange={treeData => console.log(treeData)}
            theme={FileExplorerTheme}
            canDrop={() => {
              return false;
            }}
            canDrag={() => {
              return false;
            }}
            generateNodeProps={({ node, path }) => {
              if (path.length === 2) {
                return {
                  style: {
                    cursor: `pointer`
                  },
                  onClick: () => {
                    console.log(node);
                    console.log(path);
                  }
                };
              }
            }}
          />
        </div>
        <Divider />

        {tagsTree.length > 0 && (
          <div style={{ height: 700 }}>
            <h3>Tags:</h3>
            <SortableTree
              treeData={tagsTree}
              onChange={treeData => console.log(treeData)}
              theme={FileExplorerTheme}
              canDrop={() => {
                return false;
              }}
              canDrag={() => {
                return false;
              }}
              generateNodeProps={({ node, path }) => {
                if (path.length === 1) {
                  return {
                    style: {
                      cursor: `pointer`
                    },
                    onClick: () => {
                      this.tagSelected(node)
                    }
                  };
                }
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default connect(state => ({
  notes: state.notes
}))(TagNav);
