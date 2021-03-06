const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { Subscriber } = require('../models/Subscriber')

// const { auth } = require("../middleware/auth");
const multer = require('multer')
var ffmpeg = require('fluent-ffmpeg');


var storage = multer.diskStorage({
   destination: (req, file, cb) => {
       cb(null, 'uploads/')
   },
   filename: (req, file, cb) => {
       cb(null, `${Date.now()}_${file.originalname}`)
   },
   fileFilter: (req, file, cb) => {
       const ext = path.extname(file.originalname)
       if (ext !== '.mp4' || ext !== '.txt') {
           return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
       }
       cb(null, true)
   }
})

var upload = multer({ storage: storage}).single("file")

//=================================
//             video
//=================================
router.post("/uploadfiles", (req, res) => {
   upload(req, res, err => {
      if(err) {
         return res.json({ success: false, err })
      }
      return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename})
   })
 })

router.post("/getSubscriptionVideos", (req, res) => {
   // 자신의 아이디를 가지고 구독한 사람들을 찾는다.
   Subscriber.find({ userFrom: req.body.userFrom })
      .exec((err, subscriberInfo) => {
         if(err) return res.status(400).send(err)
         
         let subscribeUser = []

         subscriberInfo.map((subscriber, i) => {
            subscribeUser.push(subscriber.userTo)
         })
         // 찾은 사람들의 비디오를 가져온다.
         Video.find({ writer: { $in: subscribeUser }})
            .populate('writer')
            .exec((err, videos) => {
               if(err) return res.status(400).send(err)
               res.status(200).json({ success: true, videos})
            })
      })

   


 })

 router.post("/uploadVideo", (req, res) => {
   // 비디오를 db에 저장한다.
   const video = new Video(req.body)
   video.save((err, doc) => {
      if(err) return res.json({ success: false, err })
      res.status(200).json({ success: true })
   })
 })

 router.get("/getVideos", (req, res) => {
   // 비디오를 db에서 가져와 클라이언트에 보낸다.
   Video.find()
      .populate('writer')
      .exec((err, videos) => {
         if(err) return res.status(400).send(err)
         res.status(200).json({ success: true, videos})
      })
 })

 router.post("/getVideoDetail", (req, res) => {
   Video.findOne({ "_id" : req.body.videoId })
      .populate('writer')
      .exec((err, videoDetail) => {
         if(err) return res.status(400).send(err)
         return res.status(200).json({ success: true, videoDetail})
      })
 })


 router.post("/thumbnail", (req, res) => {
    
   // 썸네일 생성 하고 비디오 러닝타임 가져오기
   console.log('21312312')
   // console.log(req)
   // 비디오 러닝 타임 생성
   let filePath ="";
   let fileDuration ="";
   console.log(req.body)
   
   ffmpeg.ffprobe(req.body.url, function(err, ffmpeg) {
      if (err) console.error(err)

      console.log('wd')
      console.dir(ffmpeg);
      //console.log(ffmpeg.format.duration);

      fileDuration = ffmpeg.format.duration;
   })

   //썸네일 생성
   ffmpeg(req.body.url)
      .on('filenames', function (filenames) {
         console.log('Will generate ' + filenames.join(', '))
         thumbsFilePath = "uploads/thumbnails/" + filenames[0];
      })
      .on('end', function () {
         console.log('Screenshots taken');
         return res.json({ success: true, url: thumbsFilePath, fileDuration: fileDuration})
         // thumbsFilePath: thumbsFilePath, fileDuration: fileDuration}
      })
      .on('error', function(err) {
         console.error(err)
         return res.json({ success: false, err })
      })
      .screenshots({
         // Will take screens at 20%, 40%, 60% and 80% of the video
         count: 3,
         folder: 'uploads/thumbnails',
         size:'320x240',
         // %b input basename ( filename w/o extension )
         filename:'thumbnail-%b.png'
      });
 })



module.exports = router;
