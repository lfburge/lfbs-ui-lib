import  React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { LFBSConst } from 'lfbs-common-lib'

import {
      Table,
      TableBody,
      TableCell,
      TableContainer,
      TableHead,
      TableRow,
      Paper,
      Grid,
      Box,
      Button
 } from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import ArticleIcon from '@mui/icons-material/Article'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'

const styles = theme => ({
  tableContainer: {
    borderRadius: 15,
    margin: '0px',
    maxWidth: '100%', 
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    backgroundColor: '#6d91d3',
    color: 'white!important',
    paddingLeft: '5px!important',
    paddingRight: '0px!important',
    paddingTop: '0px!important',
    paddingBottom: '0px!important',
  },
  tableCell: {
    paddingLeft: '5px!important',
    paddingRight: '0px!important',
    paddingTop: '0px!important',
    paddingBottom: '0px!important',
  },
  actionButton: {
    width: '20px',
    paddingLeft: '0px!important',
    paddingRight: '0px!important',
    paddingTop: '0px!important',
    paddingBottom: '0px!important',
  }
})

function LFBSDataGrid({dataViewProps,classes}) {
  let columnId = undefined
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

  const handleDelete = (selectedIndex) => (event) => {
    event.stopPropagation()
    if(dataViewProps.handleEditMode) {
      dataViewProps.handleEditMode(lfbsConst.DELETE,selectedIndex)
    }
  }

  const handleDetails = (selectedIndex) => (event) => {
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

  const getColumnId = () => 
  {
    if(columnId != undefined) {
      return(columnId)
    }

    columnId = ""

    dataViewProps.lfbsDatacolumns.forEach(col => {
      if(col.isKey) {
        columnId = col.attribute
      }
    })

    return(columnId)
  } 

  const getObjectKey = (rowIndx) => {
    // This method will generate unique keys for generated html objects 
    // this helps React with determining if objects have changed and need 
    // to be rendered.  We will use the row's id to deferentiate.  
    // This is only needed when using array.map to build the component.
    let key = "" + rowIndx
    let colId = getColumnId()

    if(colId.length > 0) {
      key = "" + getColumnData(rowIndx,colId)
    } 

    return(key)
  }

  return (
    <Grid container>
        <Box
          item
          component={Grid}
          sm={12}
          display={{ xs: "none", sm: "block" }}
        >
          <TableContainer component={Paper} className={classes.tableContainer} >
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  {dataViewProps.lfbsDatacolumns.map((col,j) => ( 
                    col.visibleGrid &&
                    <TableCell key={col.label + j} className={classes.tableHeaderCell}>
                      {col.label}
                    </TableCell>
                  ))}
                  {
                    dataViewProps.discoverable &&
                    <TableCell className={classes.tableHeaderCell}></TableCell>
                  }            
                  { 
                    dataViewProps.editable &&
                      <TableCell className={classes.tableHeaderCell}></TableCell>
                  }
                  { 
                    dataViewProps.deleteable &&
                    <TableCell className={classes.tableHeaderCell}></TableCell>
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {dataViewProps.data.map((row,i) => (
                  <TableRow
                    key={getObjectKey(i)}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  {dataViewProps.lfbsDatacolumns.map((col,j) => ( 
                    col.visibleGrid && 
                    <TableCell key={getObjectKey(i) + j} className={classes.tableCell}>
                      {getColumnData(i,col.attribute)}
                    </TableCell>
                  ))} 
                  {
                    dataViewProps.discoverable &&
                      <TableCell key={getObjectKey(i) + "dis"}>
                        <Button color="primary" className={classes.actionButton}
                            onClick={handleDetails(i)} >
                          <ArticleIcon/>
                        </Button>
                      </TableCell>
                  }            
                  { 
                    dataViewProps.editable && isRowEditable(i) &&
                      <TableCell key={getObjectKey(i) + "e"}>
                        <Button color="primary" className={classes.actionButton}
                            onClick={handleEdit(i)} >
                          <EditIcon />
                        </Button>
                      </TableCell>
                  }
                  { 
                    dataViewProps.editable && !isRowEditable(i) &&
                      <TableCell key={getObjectKey(i) + "ne"}>
                      </TableCell>
                  }
                  { 
                    dataViewProps.deleteable && isRowDeleteable(i) &&
                      <TableCell key={getObjectKey(i) + "d"}>
                        <Button color="primary" className={classes.actionButton} 
                            onClick={handleDelete(i)}>
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                  }
                  { 
                    dataViewProps.deleteable && !isRowDeleteable(i) &&
                      <TableCell key={getObjectKey(i) + "nd"}>
                      </TableCell>
                  }
                </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
  )
}

export default withStyles(styles)(LFBSDataGrid)
