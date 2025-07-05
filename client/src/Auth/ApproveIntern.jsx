import React from 'react'
import {useParams,useNavigate} from "react-router-dom"
import { useEffect } from 'react';


const ApproveIntern = () => {
    const {token}= useParams();
    const navigate = useNavigate
  return (
    <div>
      Approving interns....
    </div>
  )
}

export default ApproveIntern
