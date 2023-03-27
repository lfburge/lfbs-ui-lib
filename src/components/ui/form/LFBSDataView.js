import  React, { useState } from 'react'

import {
  TextField,
  TablePagination,
  Typography,
  InputAdornment,
  Grid,
  Button
} from '@mui/material'

import { LFBSConst } from 'lfbs-common-lib'

import { withStyles } from '@material-ui/core/styles'

import LFBSDataGrid from './LFBSDataGrid'
import LFBSDataDetail from './LFBSDataDetail'
import LFBSDataEdit from './LFBSDataEdit'

import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'

const styles = theme => ({
  root: {
    margin: '0px',
  },
  searchContainer: {
    paddingTop: '5'
  },
  pagination: {
    maxWidth: '100%'
  },
  dividerTitle: {
    backgroundColor: 'lightgray',
    textAlign: 'center',
    height: '35px',
    margin: '1px',
  },
  addActionButton: {
    textTransform: 'none',
    alignItems: 'center',
    backgroundColor: 'lightgray',
  }  
})

function LFBSDataView({appProps,dataViewProps,classes}) {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [filter, setFilter] = useState("")
  const lfbsConst = new LFBSConst()

  const handleChangePage = (event, newPage) => {
    getData(newPage,rowsPerPage,filter)
  }

  const handleChangeRowsPerPage = (event) => {
    getData(0,parseInt(event.target.value, 10),filter)
  }

  const getData = (currentPage,currentRowsPerPage,searchFilter) => {
    setPage(currentPage)
    setRowsPerPage(currentRowsPerPage)
    setFilter(searchFilter)

    dataViewProps.getDataMethod(currentPage,currentRowsPerPage,searchFilter)
  }

  const onSearchChange = e => {
     getData(0,rowsPerPage,e.target.value)
  }

  const handleAdd = () => {
    if(dataViewProps.handleEditMode) {
      dataViewProps.handleEditMode(lfbsConst.CREATE,-1)
    }
  }

  return (
    <div className={classes.root}>
      {(dataViewProps.title !== "") &&
        <div className={classes.dividerTitle}>
          <Typography
              variant="h6"
              noWrap
              component="div"
            >
              {dataViewProps.title}
          </Typography>
        </div>
      }

      {(dataViewProps.editMode === lfbsConst.READ) && (dataViewProps.searchable) && 
        <Grid container justifyContent="flex-end" className={classes.searchContainer}>
          <TextField
            id="filter"
            name="filter"
            label="Filter"
            autoComplete="filter"
            variant="standard"
            onChange={onSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )}}
            /> 
        </Grid>
      }

      {(dataViewProps.editMode === lfbsConst.READ) && 
        <div>
          <LFBSDataGrid dataViewProps={dataViewProps}></LFBSDataGrid>
          <LFBSDataDetail dataViewProps={dataViewProps}></LFBSDataDetail>
        </div>
      } 

      {(dataViewProps.editMode !== lfbsConst.READ) && 
          <LFBSDataEdit appProps={appProps} dataViewProps={dataViewProps}></LFBSDataEdit>
      }

      {(dataViewProps.editMode === lfbsConst.READ) && (dataViewProps.paging) && 
          <TablePagination className={classes.pagination}
            rowsPerPageOptions={[5, 10, 20, 50]}
            component="div"
            count={dataViewProps.totalItems}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            showFirstButton={true}
            showLastButton={true}>
          </TablePagination>
      }

      { (dataViewProps.editMode === lfbsConst.READ) && dataViewProps.createable &&
        <div className={classes.addActionButton}>
          <Button color="primary"  fullWidth onClick={handleAdd}>
            <AddIcon/>
              {dataViewProps.createText + " " + dataViewProps.entity}  
          </Button>
        </div>
      }

    </div>
  )
}

export default withStyles(styles)(LFBSDataView)
