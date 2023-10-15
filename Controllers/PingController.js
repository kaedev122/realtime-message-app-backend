const {v2} = require('cloudinary');
const {createReadStream} = require('streamifier')

module.exports.Ping = async (req, res, next) => {
    res.status(201).json({
        message: 'Pong!',
        success: true,
    });
};

module.exports.UploadAvatar = async (req, res) => {
    if (req.file === undefined) return res.send("you must select a file.");
    const imgUrl = `http://localhost:3001/avatar/${req.file.filename}`;
    return res.send(imgUrl);
};

module.exports.UploadImage = async (req, res) => {
    const stream = await v2.uploader.upload_stream({
        folder: "demo",
    }, (error, result) => {
        if (error) return console.error(error);
        res.status(200).json(result);
    });
    createReadStream(req.file.buffer).pipe(stream);
}