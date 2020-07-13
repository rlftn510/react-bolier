import React, {useState, useEffect} from 'react'
import { Form, Typography, Input, Button, Icon} from 'antd'
import Dropzone from 'react-dropzone'
import Axios from 'axios'

const { Title } = Typography
const { TextArea } = Input

const PrivateOptions = [
   {value: 0, label: 'Private'},
   {value: 1, label: 'Public'},
]

const CategoryOptions = [
   {value: 0, label: 'Film & Animation'},
   {value: 1, label: 'Autos & Veh'},
   {value: 2, label: 'music'},
   {value: 3, label: 'Book'},
]

function VideoUploadPage() {

      const [VideoTitle, setVideoTitle] = useState("");
      const [Description, setDescription] = useState("");
      const [Private, setPrivate] = useState(0);
      const [Category, setCategory] = useState("FIle & Animation");

      const [FilePath, setFilePath] = useState('')
      const [Duration, setDuration] = useState('')
      const [ThumbnailPath, setThumbnailPath] = useState('')

      const onTitleChange = (e) => {
         setVideoTitle(e.currentTarget.value)
      }
      const onDescriptionChange = (e) => {
         setDescription(e.currentTarget.value)
      }
      const onPrivateChange = (e) => {
         setPrivate(e.currentTarget.value)
      }
      const onCategoryChange = (e) => {
         setCategory(e.currentTarget.value)
      }
      const onDrop = (files) => {
         let formData = new FormData;
         const config = {
            header: {'content-type': 'multipart/form-data'}
         }
         formData.append('file', files[0])
         console.log(files)
         Axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
               if(response.data.success) {
                  console.log(response)
                  
                  let variable = {
                     url: response.data.url,
                     fileName: response.data.fileName
                  }

                  setFilePath(response.data.url)
                  Axios.post('/api/video/thumbnail', variable)
                     .then(response => {
                        console.log(response)
                        if(response.data.success) {
                           setDuration(response.data.fileDuration)
                           setThumbnailPath(response.data.url)
                        } else {
                           alert('thumbnail API faild')
                        }
                     })
               } else {
                  alert('실패')
               }
            })
      }

      return (
         <div style={{ maxWidth:'700px', margin:'2rem auto'}}>
            <div style={{ textAlign:'center', marginBottom:'2rem'}}>
               <Title level={2}>Upload Video</Title>
            </div>
            <Form onSubmit>
               <div style={{ display:'flex', justifyContent:'space-between'}}>
                  <Dropzone
                  onDrop={onDrop}
                  multiple={false}
                  maxSize={800000000}
                  >
                  {({ getRootProps, getInputProps}) => (
                     <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'}} {...getRootProps()}
                     >
                        <input {...getInputProps()}/>
                        <Icon type="plus" style={{ fontSize: '3rem'}}></Icon>
                     </div>
                  )}

                  </Dropzone>
                  {ThumbnailPath && 
                     <div>
                        <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                     </div>
                  }
               </div>
               <br/>
               <br/>
               <label>Title</label>
               <Input
                  onChange={onTitleChange}
                  value={VideoTitle}
               />
               <br/>
               <br/>
               <label>description</label>
               <TextArea
                  onChange={onDescriptionChange}
                  value={Description}
               />
               <br/>
               <br/>

               <select onChange={onPrivateChange}>
                  {PrivateOptions.map((item, index) => (
                     <option key={index} value={item.value}>{item.label}</option>
                  ))}
               </select>
               <br/>
               <br/>
               <select onChange={onCategoryChange}>
                  {CategoryOptions.map((item, index) => (
                     <option key={index} value={item.value}>{item.label}</option>
                  ))}
               </select>
               <br/>
               <br/>
               <Button type="primary" size='large' onClick>
                  Submit
               </Button>
            </Form>
         </div>
      )
}

export default VideoUploadPage
