import React, {useEffect,useState} from 'react'

import { withStyles } from '@material-ui/core/styles'

import {
  Hidden,
  List,
  ListItem,
  Avatar,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core'

import clsx from 'clsx'

const styles = theme => ({
  activeAvatar: {
    backgroundColor: theme.palette.primary[theme.palette.type]
  },
  menuDrawer: {
    height: "100vh",
    overflow: 'auto',
  },
  toolbar: theme.mixins.toolbar,
  listItem: {
    '&.active, &:hover, &.active:hover': {
      '& path': {
          fill: "black"
      },
    }
  }
})

const LFBSDrawerMenu = ({menuOptions,classes}) => {

  return (
    <div className={classes.menuDrawer}>
          <Hidden smDown>
            <div className={classes.toolbar} />
          </Hidden>

        <List>
          {menuOptions.map(({ Icon, ...item }, index) => (
              <ListItem key={index} button component="a" href={item.url} 
                        target={item.target} className={classes.listItem}>
                <ListItemIcon>
                  <Avatar
                    className={clsx({
                      [classes.activeAvatar]: item.notifications
                    })}
                  >
                    <Icon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText className={classes.listItemText}
                  primary={item.title}
                  secondary={item.subtitle}
                />
              </ListItem>
          ))}
        </List>
      </div>
      )
 }
  


export default withStyles(styles)(LFBSDrawerMenu)
