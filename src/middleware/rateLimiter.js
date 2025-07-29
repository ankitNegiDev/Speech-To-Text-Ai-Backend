
import rateLimit from "express-rate-limit";
/**
 * there might be a question why we are not calling next if - this is a middleware its because express-rate-limit returns a fully functional middleware function that already handles the next() call internally.
 * when we do like this - router.post("/upload", generalLimiter, uploadAudio);
 *  Express runs generalLimiter or normal rate limitter(req, res, next) for us behind the scenes and the limiter calls next() if the request is within limit else sends a 429 response if not.
 */

// this is normal rate limmter -- we will change it accordingly-- once the frontend is built.
export const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window -- means only max - 30 request will be allowed in 1 min.
    max: 30, // limit each IP to 30 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
});

// Stricter limiter for expensive endpoints (e.g., translate)
export const strictLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // only 5 requests allowed per minute
    message: "Rate limit exceeded for this endpoint. Please wait a moment.",
});
