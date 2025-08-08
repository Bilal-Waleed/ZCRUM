import React from 'react'

const Organization = ({params}) => {
    const { orgId } = params;
  return (
    <div className='container p-10'>{orgId}</div>
  )
}

export default Organization;