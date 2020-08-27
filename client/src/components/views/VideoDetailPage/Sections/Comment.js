import React, { useState } from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import SingleComment from './SingleComment'

function Comment(props) {

   const videoId = props.postId
   const user = useSelector(state => state.user)
   const [CommentValue, setCommentValue] = useState("")

   const handleClick = (event) => {
      setCommentValue(event.currentTarget.value)
   }

   const onSubmit = (event) => {
      event.preventDefault()
      const variabale = {
         content: CommentValue,
         writer: user.userData._id,
         postId: videoId 
      }
      Axios.post('/api/comment/saveComment', variabale).then(res => {
         if(res.data.success) {
            console.log(res.data)
         } else {
            alert('저장실패')
         }
      })
   }

   return (
      <div>
         <br />
         <p>Replies</p>
         <hr />

         {/* commnet List */}
         <SingleComment />
         {/* Root commnet from */}

         <form style={{ display: 'flex' }} onSubmit={onSubmit}>
            <textarea 
               style={{ width: '100%', borderRadius: '5px' }}
               onChange={handleClick}
               value={CommentValue}
               placeholder="코멘트를 작성해주세요"
            />
            <br/>
            <button style={{ width: '20%', height: '52px'}} onClick={onSubmit}>Submit</button>
         </form>
      </div>
   )
}

export default Comment