module.exports.Ping = async (req, res, next) => {
    res.status(201).json({
        message: 'Pong!',
        success: true,
    });
};
