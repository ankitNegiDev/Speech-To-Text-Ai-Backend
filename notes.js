// https://docs.google.com/document/d/1oI1nxZOKAs9ywL7CtPwd0XRdwjTZzzoJOTflADxsROU/edit?usp=sharing


// project
// https://docs.google.com/document/d/1b56kkyp-GE9CRbYz0SwNL6jRTWhUQP6df9oiAIe-Q_o/edit?usp=sharing


// viral jain -- linkdin
// https://www.linkedin.com/in/jain-viral/

// scrimba
// https://scrimba.com/home



/**
 * If we are using Clerk or any custom middleware that attaches user data to req.user, then:
If req.user.id is a string (like Clerk's user ID), then: Use req.user.id
If we are using our own Mongoose-based auth system, and req.user comes from MongoDB, then req.user._id is the correct one.
 */