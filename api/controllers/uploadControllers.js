const { v2: cloudinary } = require('cloudinary')
const streamifier = require('streamifier');


cloudinary.config({ cloud_name: 'dz88yjerw', api_key: '148133121975522', api_secret: 'yS79oXe6ZmIuNWG1fXnOCpdOAH4' }); // Use multer to store files in memory 

exports.uploadImage = async (req, res, next) => {


    if (!req.file) { return res.json({ error: 'No file uploaded' }).status(400); } // Create an upload stream and pipe the file buffer to Cloudinary 
    let uploadStream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.json(result);
    });
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

}
exports.uploadVideo = async (req, res, next) => {

    console.log('video upload....', req.file.mimetype)
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Optional: validate file type before uploading
    const fileType = req.file.mimetype.split('/')[0];
    console.log('video upload stream....', fileType)

    if (fileType !== 'video') {
        return res.status(400).json({ error: 'Uploaded file is not a video' });
    }

    // Create an upload stream and pipe the file buffer to Cloudinary
    let uploadStream = cloudinary.uploader.upload_stream(
        {
            resource_type: 'video', // Explicitly specify that it's a video
            public_id: req.file.originalname.split('.')[0], // Optional: Set a custom public ID
            chunk_size: 6000000 // Optional: Set the chunk size for video uploads
        },
        (error, result) => {
            if (error) {
                return res.status(500).json({ error });
            }
            res.json(result);
        }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

};


exports.getPost = async (req, res, next) => {

}