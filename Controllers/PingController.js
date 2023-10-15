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
