import React from 'react'
import {Routes, Route} from 'react-router-dom'
import CleanUpFile from '../components/CleanUpFile'
import DataTable from '../components/DataTable'
import FileUpload from '../components/FileUpload'

function MainRoute() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<CleanUpFile/>}/>
            <Route path='/table' element={<FileUpload/>}/>
        </Routes>
    </div>
  )
}

export default MainRoute