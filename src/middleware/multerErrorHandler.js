import multer from 'multer';

export function multerErrorHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            console.error("🛑 File too large:", err.message);
            return res.status(400).json({ success: false, message: "File too large. Max size is 50MB." });
        }
        console.error("🛑 Multer error:", err.message);
        return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
        console.error("🛑 Unknown upload error:", err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
    next();
}
