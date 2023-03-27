
import React from 'react'

const LFBSPrettyPrintJson = ({appProps,jsonData}) => {

  return (
	  		<div>
		  		{appProps.logLevel !== appProps.LOG_LEVEL_NONE && 
				  <pre> 
				    {JSON.stringify(jsonData, null, 2) }
				  </pre>
				}
			</div>
	    )
}
  

export default (LFBSPrettyPrintJson)
