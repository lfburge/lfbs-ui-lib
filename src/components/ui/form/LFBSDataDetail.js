import  React from 'react'
import { withStyles } from '@material-ui/core/styles'

import { LFBSConst } from 'lfbs-common-lib'

import {
      Grid,
      Box,
      Card,
      CardHeader,
      CardContent,
      Typography,
      Divider,
      Button,
      CardActions
 } from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import ArticleIcon from '@mui/icons-material/Article'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'

const styles = theme => ({
  card: {
    cursor:'pointer',
    margin: "0px",
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"},
  },
  cardContent: {
    textAlign: "left",
    paddingLeft: '25px!important'
  },
  cardContentTitle: {
    textAlign: "center",
    backgroundColor: '#1b438d',
    color: 'white!important'
  },
  cardContentText: {
    textAlign: "left",
    paddingLeft: '25px!important'
  },
  cardHeading: {
    fontWeight: "bold",
  },
  cardSubHeading: {
    backgroundColor: '#1b438d',
    color: 'white!important'
  },
  cardDivider: {
    margin: '10px' 
  },
  cardBox: {
    backgroundColor: '#6d91d3'
  },
  cardActions: {
    display: "flex",
    textTransform:'none',
    backgroundColor: 'lightGray',
    alignItems: 'center'
  },
  actions: {
    display: "flex"
  },
})

function LFBSDataGrid({dataViewProps,classes}) {
  const lfbsConst = new LFBSConst()

  const getColumnData = (rowIndx,columnAttribute) => {
    return(dataViewProps.getColumnDataMethod(rowIndx,columnAttribute))
  }

  const handleEdit = (selectedIndex) => (event) =>  {
    event.stopPropagation()
    if(dataViewProps.handleEditMode) {
      dataViewProps.handleEditMode(lfbsConst.UPDATE,selectedIndex)
    }
  }

  const handleDelete = (selectedIndex) => (event) =>  {
    event.stopPropagation()
    if(dataViewProps.handleEditMode) {
      dataViewProps.handleEditMode(lfbsConst.DELETE,selectedIndex)
    }
  }

  const handleDetails = (selectedIndex) => (event) =>  {
    event.stopPropagation()
    if(dataViewProps.handleEditMode) {
      dataViewProps.handleEditMode(lfbsConst.DETAIL,selectedIndex)
    }
  }

  const isRowDeleteable = (selectedIndex) => {
    if(dataViewProps.isRowDeleteableMethod) {
      return(dataViewProps.isRowDeleteableMethod(selectedIndex))
    }

    return(dataViewProps.deleteable)
  }

  const isRowEditable = (selectedIndex) => {
    if(dataViewProps.isRowEditableMethod) {
      return(dataViewProps.isRowEditableMethod(selectedIndex))
    }

    return(dataViewProps.editable)
  }

  return (
    <Grid container>
        <Box className={classes.cardBox}
          item
          component={Grid}
          xs={12}
          display={{ sm:"none",md: "none",lg: "none" }}
        >
          {dataViewProps.data.map((row,i) => (
            <Card className={classes.card} 
               key={"detail"+i}>
              <CardHeader className={classes.cardHeading}
                avatar={getColumnData(i,"avatar")}
                title={getColumnData(i,"title")}
                subheader={getColumnData(i,"subTitle")}
              />

              <Divider></Divider>
              <CardContent className={classes.cardContent}>
                  {dataViewProps.lfbsDatacolumns.map((col,j) => ( 
                    (col.visibleDetail && getColumnData(i,col.attribute) !== "")  && 
                    <div key={"detailColumn" + i + j}>
                      <Typography>{col.label}</Typography>
                      <Typography variant="body2" color="text.secondary">{getColumnData(i,col.attribute)}</Typography>
                    </div>
                  ))}
              </CardContent>
              <CardActions className={classes.cardActions}>
                { 
                    isRowEditable(i) &&
                    <Button color="primary" onClick={handleEdit(i)} >
                      <EditIcon/>
                    </Button>
                }
                { 
                    isRowDeleteable(i) &&
                    <Button color="primary" onClick={handleDelete(i)} >
                      <DeleteIcon/>
                    </Button>
                }
                {
                  dataViewProps.discoverable &&
                    <Button color="primary" onClick={handleDetails(i)} >
                      <ArticleIcon/>
                    </Button>
                }
              </CardActions>
            </Card>
          ))
          }
        </Box>
      </Grid>
  )
}

export default withStyles(styles)(LFBSDataGrid)
