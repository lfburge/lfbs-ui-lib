import React, { useState } from 'react'

import {
      Grid,
      Box,
      Typography,
      CssBaseline,
      Paper,
      TextField,
      Button,
      FormControlLabel,
      Checkbox,
      NativeSelect
 } from '@mui/material'

 import { withStyles } from '@material-ui/core/styles'

 import { LFBSUtils,LFBSConst } from 'lfbs-common-lib'

 import LFBSMultiSelectWithCheckbox  from '../common/LFBSMultiSelectWithCheckbox'

 const styles = theme => ({
  controlButton: {
    textTransform:'none',
    marginLeft: '10px!important', 
    width: '100px'
  },
  dividerTitle: {
    backgroundColor: 'lightgray',
    textAlign: 'center',
    height: '35px',
    width: '100%'
  },
})

function LFBSDataEdit({appProps,dataViewProps,classes}) {
  const [optionData] = useState({})
  const lfbsUtils = new LFBSUtils()
  const lfbsConst = new LFBSConst()

  const getColumnData = (columnAttribute) => {
    return(dataViewProps.getColumnDataMethod(dataViewProps.selectedIndex,columnAttribute))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const entity = {}

    console.log(`${JSON.stringify(optionData)}`)

    dataViewProps.lfbsDataColumns.forEach(col => {
      if(isColumnEditable(col) || isColumnKey(col) ) {
        if(isColumnKey(col)) {
          if(getColumnData(col.attribute) !== null) {
            entity[col.attribute] = getColumnData(col.attribute)
          }
        } else if(isColumnSingleSelect(col)) {
          entity[col.attribute] = optionData[col.attribute]
        } else if(isColumnMultipleSelect(col)) {
          if(optionData[col.attribute].length > 0) {
            entity[col.attribute] = optionData[col.attribute]
          }
        } else {
          entity[col.attribute] = data.get(col.attribute)
        }
        console.log(`handleSubmit - entity[${col.attribute}] = <${entity[col.attribute]}>`)
      }
    })

    if(!validateForm(entity)) {
      return
    }

    console.log(`handleSubmit - <${dataViewProps.editMode}> -  ${JSON.stringify(entity)} `)

    if(dataViewProps.editMode === lfbsConst.CREATE) {
      if(dataViewProps.handleCreate !== null) {
        await dataViewProps.handleCreate(entity)
      } else {
        appProps.notifyUser(`${dataViewProps.entity} no ${dataViewProps.editMode} method defined."`,lfbsConst.SEVERITY_ERROR)
      }
    } else if(dataViewProps.editMode === lfbsConst.UPDATE) {
      if(dataViewProps.handleUpdate !== null) {
        await dataViewProps.handleUpdate(entity)
      } else {
        appProps.notifyUser(`${dataViewProps.entity} no ${dataViewProps.editMode} method defined."`,lfbsConst.SEVERITY_ERROR)
      }
    } else if(dataViewProps.editMode === lfbsConst.DELETE) {
      if(dataViewProps.handleDelete !== null) {
        await dataViewProps.handleDelete(entity)
      } else {
        appProps.notifyUser(`${dataViewProps.entity} no ${dataViewProps.editMode} method defined."`,lfbsConst.SEVERITY_ERROR)
      }
    }
  }

  const validateForm = (entity) => {
    let validationErrors = []

    dataViewProps.lfbsDatacolumns.forEach(col => {
//      console.log(`validateForm - ${JSON.stringify(col)}>`)
      if(isColumnEditable(col)) {
        if(isColumnRequired(col)) {
          if(entity[col.attribute]) {
            if(isColumnString(col) && entity[col.attribute].trim() === "") {
              validationErrors.push(`${col.label} is required`)
            }
          } else {
            validationErrors.push(`${col.label} is required`)
          }
        }
        if(isColumnNumber(col) && !validateNumber(entity[col.attribute])) {
          validationErrors.push(`${col.attribute} is not a valid email`)
        }
        if(isColumnEmail(col) && !validateEmail(entity[col.attribute])) {
          validationErrors.push(`${entity[col.attribute]} is not a valid email`)
        }
      }
    }) 

    if(validationErrors.length > 0) {
      appProps.notifyUser(validationErrors.join(', '),lfbsConst.SEVERITY_ERROR)
      return(false)
    }

    return(true)
  }

  const validateNumber = (numberToTest) => {
    return !isNaN(numberToTest)
  }

  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  const onClose = (event) => {
    event.preventDefault()

    dataViewProps.handleEditMode(lfbsConst.READ,-1)
  }

  const isColumnVisible = (column) => {
    let columnVisible = column.visibleEdit

    if(columnVisible && (column.dataType === lfbsUtils.COLUMN_TYPE_ID)) {
      columnVisible = dataViewProps.selectedIndex !== -1    
    }   
     
     return(columnVisible)
  }

  const isColumnEditable = (column) => {
    let columnEditable = false

    if((dataViewProps.editMode === lfbsConst.DELETE) || 
      (dataViewProps.editMode === lfbsConst.DETAIL)) {
        columnEditable = false       
    } else {
      columnEditable = column.editable       
    }

    return columnEditable
  }

  const isColumnRequired = (column) => {
    let columnRequired = false

    columnRequired = isColumnEditable(column) && column.required

    return(columnRequired)
  }

  const isColumnKey = (column) => {
    return(column.isKey)
  }

  const isColumnString = (column) => {
    return(column.dataType === lfbsUtils.COLUMN_TYPE_STRING)
  }

  const isColumnNumber = (column) => {
    return(column.dataType === lfbsUtils.COLUMN_TYPE_NUMBER)
  }

  const isColumnEmail = (column) => {
    return(column.dataType === lfbsUtils.COLUMN_TYPE_EMAIL)
  }

  const isColumnBoolean = (column) => {
    return(column.dataType === lfbsUtils.COLUMN_TYPE_BOOLEAN)
  }

  const isColumnSingleSelect = (column) => {
    return(column.dataType === lfbsUtils.COLUMN_TYPE_SINGLE_SELECT)
  }

  const isColumnMultipleSelect = (column) => {
    return(column.dataType === lfbsUtils.COLUMN_TYPE_MULTIPLE_SELECT)
  }

  const getSelectList = (selectedIndex,col) => {
    if(!dataViewProps.getSelectListMethod) {
      console.error(`Missing getSelectListMethod implementation for ${dataViewProps.entity} - ${col.label}`)
    } else {
      return(dataViewProps.getSelectListMethod(selectedIndex,col.attribute))
    }
  }

  const handleSingleSelectChange = (col) => (event) => {
    optionData[event.target.id] = event.target.value 
    console.log(JSON.stringify(optionData))
  }  

  const handleMultipleSelectChange = (colAttribute,selectedOptions) => {

    optionData[colAttribute] = []

    if(selectedOptions && selectedOptions.length > 0) {
      selectedOptions.forEach((selectedOption) => {
        optionData[colAttribute].push(selectedOption)
      })
    }
  }

  const getSelectedOptions = (col) => {
    handleMultipleSelectChange(col.attribute,getColumnData(col.attribute))        
    return(optionData[col.attribute])
  }

  return (
    <div>
      <div className={classes.dividerTitle}>
        <Typography component="h1" variant="h5">
          {dataViewProps.entity} {dataViewProps.editMode}
        </Typography>
      </div>

      <Grid container component="main" sx={{ height: '100%' }}>
        <CssBaseline />
        <Grid item xs={12} component={Paper} elevation={6} square>
          <Box
            sx={{
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
            }}
          >
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                  {dataViewProps.lfbsDataColumns.map((col,i) => ( 
                      (isColumnVisible(col)) &&
                        <div key={"editColumn" + i}>
                          {!isColumnEditable(col) && 
                            <div>
                              <Typography>{col.label}</Typography>
                              <Typography variant="body2" color="text.secondary">{getColumnData(col.attribute)}</Typography>
                            </div>
                          }

                          {(isColumnEditable(col) && 
                           (isColumnString(col) || isColumnEmail(col) || isColumnNumber(col))) && 
                            <TextField
                              margin="normal"
                              fullWidth
                              required={isColumnRequired(col)}
                              id={col.attribute}
                              label={col.label}
                              name={col.attribute}
                              autoFocus={false}
                              defaultValue={getColumnData(col.attribute)}
                            />
                          }

                          {(isColumnEditable(col) && isColumnBoolean(col) ) && 
                            <FormControlLabel control={
                              <Checkbox defaultChecked={getColumnData(col.attribute)=== "true" ? true : false} />}
                              label={col.label} />                          
                          }

                          {(isColumnEditable(col) && isColumnSingleSelect(col)) && 
                            <div>
                              <Typography>{col.label}</Typography>
                              <NativeSelect fullWidth
                                id={col.attribute}
                                onChange={handleSingleSelectChange(col)}
                                defaultValue={getColumnData(col.attribute)}
                              >
                                <option value=""></option>
                                {getSelectList(dataViewProps.selectedIndex,col)}
                              </NativeSelect>                            
                            </div>
                          }

                          {(isColumnEditable(col) && isColumnMultipleSelect(col)) && 
                            <div>
                              <LFBSMultiSelectWithCheckbox options={getSelectList(dataViewProps.selectedIndex,col)} 
                                lfbsDataColumn={col} handleChangeEvent={handleMultipleSelectChange}
                                selectedOptions={getSelectedOptions(col)}>
                              </LFBSMultiSelectWithCheckbox>
                            </div>
                          }
                        </div>
                  ))}

              <Box
                  sx={{
                  my: 8,
                  mx: 4,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignContent: 'space-between'
                }}
                >
                  { dataViewProps.editMode !== lfbsConst.DETAIL &&
                    <Button type="submit" variant="contained"
                      className={classes.controlButton}
                    >
                      OK
                    </Button>
                  }
                  <Button onClick={onClose} variant="contained"
                    className={classes.controlButton}
                  >
                    Close
                  </Button>
                  </Box>
              </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  )

}
export default withStyles(styles)(LFBSDataEdit)
