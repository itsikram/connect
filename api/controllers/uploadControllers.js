const { v2: cloudinary } = require('cloudinary')
const streamifier = require('streamifier');


cloudinary.config({ cloud_name: 'dz88yjerw', api_key: '148133121975522', api_secret: 'yS79oXe6ZmIuNWG1fXnOCpdOAH4' }); // Use multer to store files in memory 

exports.uploadPost = async (req, res, next) => {

    if (!req.file) { return res.status(400).json({ error: 'No file uploaded' }); } // Create an upload stream and pipe the file buffer to Cloudinary 
    let uploadStream = cloudinary.uploader.upload_stream((error, result) => { 
        if (error) { 
            return res.status(500).json({ error }); 
        } 
        res.json(result); 
    }); 
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

}

exports.getPost = async (req, res, next) => {

}