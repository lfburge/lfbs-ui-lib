import React, { useState } from "react"
import Checkbox from "@material-ui/core/Checkbox"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"
import { withStyles } from '@material-ui/core/styles'

import {
  LFBSUtils
} from 'lfbs-common-lib'

const userTheme = new LFBSUtils().getUserUITheme()

const styles = theme => ({
  formControl: {
//    margin: theme.spacing(1),
    width: '100%',
  },
  indeterminateColor: {
    color: "#f50057"
  },
  selectAllText: {
    fontWeight: 500
  },
  selectedAll: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.08)"
    }
  },
  selectControl: {
      color: (userTheme === "light" ? "black" : "white"),
      backgroundColor: "transparent",
    }
})

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center"
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center"
  },
  variant: "menu"
}

const LFBSMultiSelectWithCheckbox = ({options,lfbsDataColumn,selectedOptions,handleChangeEvent,classes}) => {

  const [selected, setSelected] = useState(selectedOptions)
  const isAllSelected = options.length > 0
                        && selected.length === options.length

  const handleChange = (event) => {
    const value = event.target.value
    let newSelection = value

    if (value[value.length - 1] === "all") {
      newSelection = selected.length === options.length ? [] : options
    }
    setSelected(newSelection)

    if(handleChangeEvent) {
       handleChangeEvent(lfbsDataColumn.attribute,newSelection)
    }
  }

  return (
    <FormControl className={classes.formControl}>
      <Select
        labelId="mutiple-select-label"
        multiple
        value={selected}
        onChange={handleChange}
        renderValue={(selected) => selected.join(", ")}
        MenuProps={MenuProps}
        className={classes.selectControl}
      >
        <MenuItem
          value="all"
          classes={{root: isAllSelected ? classes.selectedAll : ""}}
        >
          <ListItemIcon>
            <Checkbox
              classes={{ indeterminate: classes.indeterminateColor }}
              checked={isAllSelected}
              indeterminate={
                selected.length > 0 && selected.length < options.length
              }
            />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.selectAllText }}
            primary="Select All"
          />
        </MenuItem>
        { 
          options.map((option) => (
            <MenuItem key={option} value={option}>
              <ListItemIcon>
                <Checkbox checked={selected.indexOf(option) > -1} />
              </ListItemIcon>
              <ListItemText primary={option} />
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
  )
}

export default withStyles(styles)(LFBSMultiSelectWithCheckbox)
