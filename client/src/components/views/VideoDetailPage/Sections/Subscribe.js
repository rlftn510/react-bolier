import React, {useEffect, useState} from 'react'
import Axios from 'axios'


function Subscribe(props) {
   
   const [SubscribeNumber, setSubscribeNumber] = useState(0)
   const [Subscribed, setSubscribed] = useState(false)

   useEffect(() => {
      let variable = { userTo: props.userTo }
      Axios.post('/api/subscribe/subscribeNumber', variable)
         .then(response => {
            if(response.data.success) {
               setSubscribeNumber(response.data.subscribeNumber)
            } else {
               alert('구독자 정보를 가져오지 못했어요.')
            }
         })

      let subscribedVarialbe = { userTo: props.userTo, userFrom: localStorage.getItem('userId')}

      Axios.post('/api/subscribe/subscribed', subscribedVarialbe)
         .then(response => {
            if(response.data.success) {
               setSubscribed(response.data.Subscribed)
            } else {
               alert('정보를 받아오지 못했어요')
            }
         })
   }, [])

   return (
      <div>
         <button
            style={{ 
               backgroundColor:`${Subscribe ? '#cc0000' : '#aaa'}`,
               borderRadius: '4px',
               color: '#fff',
               padding: '10px 16px',
               fontWeight: '500',
               fontSize: '1rem',
               textTransform: 'uppercase'
            }}
            onClick
         >
            {SubscribeNumber} {Subscribed ? 'SUBCRIBED' : 'SUBCTIBE'}
         </button>
      </div>
   )
}

export default Subscribe
