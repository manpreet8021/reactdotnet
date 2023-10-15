import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { Header, Icon } from 'semantic-ui-react';

interface Props{
  setFiles: (files: any) =>void;
}

export default function PhotoWidgetDropzone({setFiles}:Props) {
  const disabledStyle = {
    border: 'dashed 3px #eee',
    borderColor: '#eee',
    borderRadious: '5px',
    paddingTop: '30px',
    textAlign: 'center' as 'center',
    height: 200
  } 

  const activeStyle = {
    borderColor: 'green'
  }

  const onDrop = useCallback((acceptedFiles:object[])  => {
    setFiles(acceptedFiles.map((file:any) => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })))
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} style={isDragActive ? {...disabledStyle, ...activeStyle} : disabledStyle}>
      <input {...getInputProps()} />
      <Icon name='upload' size='huge'/>
      <Header content='Drop files here...' />
    </div>
  )
}