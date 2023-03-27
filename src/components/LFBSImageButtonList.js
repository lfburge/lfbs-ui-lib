import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import { Card,
         CardContent,
         CardMedia,
         Typography,
         CardActionArea,
         Box
       } from '@mui/material'

import ImageList from "@material-ui/core/ImageList"

const styles = theme => ({
  imageList: {
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    minWidth: '300px',
    maxWidth: '300px',
    marginTop: '15px',
    marginLeft: '15px',
    minHeight: '220px',
    borderBottom: '7px solid black',
    "&:hover": {
       borderBottom: '7px solid blue',
       boxShadow: 'black'
    }
  },
  cardMedia: {
    paddingTop: '20px',
    paddingLeft: '33%',
    paddingRight: '33%',
    width: '100%',
    height: '100%',
    textAlign: 'center',
  }
})

const LFBSImageButtonList = ({classes,lfbsImageButtons}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        bgcolor: 'background.paper',
      }}
    >
      <ImageList rowHeight={"auto"} className={classes.imageList}>
          {lfbsImageButtons.map((tile,i) => (
            <Card className={classes.card} 
                  key={i} >
              <CardActionArea href={tile.link} target={tile.target}>
                <CardMedia
                  className={classes.cardMedia}
                  component="img"
                  alt={tile.title}
                  image={"" + tile.img}
                  title={tile.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="body2" component="h2" noWrap textAlign={`center`}>
                    {tile.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign={`center`}>
                    {tile.subTitle}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
      </ImageList>
    </Box>
  )
}

export default withStyles(styles)(LFBSImageButtonList)

