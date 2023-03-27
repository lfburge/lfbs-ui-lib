
import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import { LFBSConst } from 'lfbs-common-lib'

import {
	Button,
	TextField,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import CancelIcon from '@mui/icons-material/Cancel'

import {
	LFBSUtils,
  } from 'lfbs-common-lib'
  
const userTheme = new LFBSUtils().getUserUITheme()

const styles = theme => ({
	root: {
		cursor:'pointer',
		border: "2px solid",
		BorderColor: (userTheme === 'light' ? 'white' : '#222222')
	},
	
	buttonGroupContainer: {
		display: "flex",
		justifyContent: "center",
		paddingLeft: "5px",
		paddingRight: "3px",
	  },
})
 
const LFBSStringArrayView = ({displayProps,column,classes}) => {
	const lfbsConst = new LFBSConst()

	const addString = () => {
		const newData = displayProps.data

		newData.push('')
	 
		refreshState(newData)
    }

	const removeString = (indx) => {
		const newData = displayProps.data

		newData.splice(indx, 1)
		refreshState(newData)
	}

	const updateString = (entity,indx) => {
		const newData = displayProps.data
		newData[indx] = entity
	
		refreshState(newData)
	  }
		
	const refreshState = (newData) => {
		if(displayProps.setDataFunc) {
			displayProps.setDataFunc(column.attribute,newData)
		}
	} 
	
	return (
		<div className={classes.root}>
			{ (displayProps.editMode === lfbsConst.CREATE || displayProps.editMode === lfbsConst.UPDATE) && displayProps.data &&
				<div>
					{displayProps.data.map((element,i) => 
						<div key={i} className={classes.buttonGroupContainer}>
							<TextField
								margin="normal"
								fullWidth
								required
								id={`stringArray${i}`}
								autoFocus={false}
								defaultValue={element}
								onChange={(e) => updateString(e.target.value,i)}
							/>
							<Button color="primary" onClick={() => {removeString(i)}}>
								<CancelIcon/>
							</Button>
						</div>
					)}

					<div className={classes.buttonGroupContainer}>
						<Button color="primary" onClick={() => {addString()}}>
							<AddIcon/> {`Add ${displayProps.title}`}
						</Button>
					</div>
				</div>
			}

			{ (displayProps.editMode !== lfbsConst.CREATE && displayProps.editMode !== lfbsConst.UPDATE) && displayProps.data &&
				displayProps.data.map((element) =>
					<div key={element}>
						{element}
					</div>
				)
			}
		</div>
	)
}
 
export default withStyles(styles)(LFBSStringArrayView)

