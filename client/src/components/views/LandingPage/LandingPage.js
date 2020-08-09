import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import { Col, Row, Typography, Avatar } from 'antd';
import Meta from 'antd/lib/card/Meta';
import Axios from 'axios';
import moment from 'moment'

const { Title } = Typography

function LandingPage() {

   const [Video, setVideo] = useState([])

   useEffect(() => {
      Axios.get('/api/video/getVideos')
         .then(response => {
            if(response.data.success) {
               setVideo(response.data.videos)
               console.log(response.data.videos)
               setTimeout(function() {
                  console.log(Video)
               }, 3000)
            } else {
               alert('비디오 가져오기를 실패 했습니다.')
            }
         })
   }, [])

   const renderCards = Video.map((video, index) => {
      console.log(video)
      var minutes = Math.floor(video.duration / 60)
      var seconds = Math.floor(video.duration - minutes * 60)

      return <Col lg={6} md={8} xs={4}>
         <a href={`/video/${video._id}`}>
            <div style={{ position: 'relative' }}>
               <img style={{width: '100%'}} src={`http://localhost:5000/${video.thumbnail}`}/>
               <div className="duration">
                  <span>{minutes} : {seconds}</span>
               </div>
            </div>
         </a>
         <br/>
         <Meta
            avatar={
               <Avatar src={video.writer.image} />
            }
            title={video.title}
            description=""
         />
         <span>{video.writer.name}</span><br/>
         <span style={{ marginLeft: '3rem' }}>{video.views} views</span> - <span>{moment(video.createdAt).format("MMM Do YY")}</span>
         
      </Col>
   })
   return (
   <div style={{width:'85%', margin: '3rem auto'}}>
      <Title level={2}>Recommended</Title>
      <hr/>
      <Row gutter={[32, 16]}>
         {renderCards}
         
      </Row>

         
   </div>
    )
}

export default LandingPage
