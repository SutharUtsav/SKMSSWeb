import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';

const UserDetails = () => {

  const params = useParams();
  const userId = params.id;

  useEffect(() => {
  
  }, [userId])
  
  return (
    <div>UserDetails</div>
  )
}

export default UserDetails