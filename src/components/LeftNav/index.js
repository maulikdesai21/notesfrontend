// This file is shared across the demos.
import React from "react";
import Grid from "@material-ui/core/Grid";

import NotesNav from "./NotesNav";
import TagsNav from "./TagsNav";

const LeftNav = () => (
  <div>
    <Grid container>
      <Grid item sm={4}>
        <TagsNav />
      </Grid>
      <Grid item sm={8}>
        <NotesNav />
      </Grid>
    </Grid>
  </div>
);
export default LeftNav;
