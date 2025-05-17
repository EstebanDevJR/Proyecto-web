const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'algo salio mal', error: err.message });
};

module.exports = errorHandler;  // Add this line to export the middleware