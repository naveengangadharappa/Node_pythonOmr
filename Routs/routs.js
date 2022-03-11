const express = require('express');
const router = express.Router();
const {PythonShell} =require('python-shell');
const path = require('path'); 
const multer = require('multer');
let storage = multer.diskStorage({
    destination:'assets/uploaded_file/',
    filename: function (req, file, cb) { 
        fname=file.fieldname + '-' + Date.now()+ '.jpg'
        cb(null, `${Date.now()}-${file.originalname}`);
    }
  })

const upload = multer({
    storage: storage,
}); 
const upload1 = multer({
    storage: storage,
}).single('file');

const arrUpload = upload.array('file', 10); //limit uploading upto 10 files at one shot

router.get('/', (req, res) => {
    res.json({ message: "Connected to Node Api server for OMR Assesment. " });
})

router.get('/Compute_omr/:filename',(req,res)=>{
    if(req.params.filename){
        let options = {
            mode: 'text',
            pythonOptions: ['-u'], // get print results in real-time
            scriptPath: 'python/OMR Scanner',//'python/OMR_Raju/OMR-Scanner-main',//'python/OMR Scanner', //If you are having python_test.py script in same folder, then it's optional.
            args: [req.params.filename]//['naveen g'] //An argument which can be accessed in the script using sys.argv[1]
        };
    
        PythonShell.run('Main_Omr.py', options, (err, result)=>{ 
            if (err) {
                res.jsonp({status:false,message:"Error in Processing Omr "});
                throw err;   
            }   else {
                console.log('result: ', result.toString());
                res.json({status:true,data:result,message:"Omr Processing Successfull"});
            }
            // res.download(path.join('./assets/uploaded_file','image.png'),'image.png');
            // res.download(path.join('./assets/uploaded_file','gray.png'),'gray.png');
            // res.download(path.join('./assets/uploaded_file','blurred.png'),'blurred.png');
            //res.download(path.join('./assets/uploaded_file','edged.png'),'edged.png');
        });
    }else res.json({status:false,message:"Invalid FileName"});
})

router.post('/Compute_omr',(req,res)=>{
    try{
        if(req.body.filename){
            let options = {
                mode: 'text',
                pythonOptions: ['-u'],  // get print results in real-time
                scriptPath: 'python/OMRScanner',   //'python/OMR_Raju/OMR-Scanner-main',//'python/OMR Scanner', //If you are having python_test.py script in same folder, then it's optional.
                args: [req.body.filename]   //['naveen g'] //An argument which can be accessed in the script using sys.argv[1]
            };
        
            PythonShell.run('Main_Omr.py', options, (err, result)=>{ 
                if (err) {
                    console.log(err);
                    res.json({status:false,message:"Error in Processing Omr Please upload file and proceed for omr computation"});
                    //throw err;   
                } else res.json({status:true,data:result,message:"Omr Processing Successfull"});
            });
        }else res.json({status:false,message:"Invalid FileName"});
    }catch(err){
           res.json({status:false,message:"Internal Server Error"}) ;
    }
})

router.get('/get_file/:filename',(req,res)=>{
    if(req.params.filename)
        res.download(path.join('./assets/uploaded_file',req.params.filename),req.params.filename);
    else res.json({status:false,Message:'Invalid File Name'})
})

router.post('/get_file',(req,res)=>{
    try{
        if(req.body.filename)
            res.download(path.join('./assets/uploaded_file',req.body.filename),req.body.filename);
        else res.json({status:false,Message:'Invalid File Name'})
    }catch(err){
        res.json({status:false,message:"Internal Server Error"}) ;
    }  
})

router.post('/upload_file',upload1,(req,res)=>{
    if(req.file){
        res.json({status:true,file_details:req.file,Message:"File upload Successfull"})
    }else{
        res.json({status:false,Message:"File upload  Unsuccessfull"})
    }
})

router.post('/upload_files',arrUpload,(req,res)=>{
    if(req.files.length>0){
        res.json({status:true,file_details:req.files,Message:"Files upload Successfull"})
    }else{
        res.json({status:false,Message:"Files not upload plz try again"})
    }
})

module.exports = router;