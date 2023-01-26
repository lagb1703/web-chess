const router = require("express").Router();
const path = require('path');

router.get('/download/',(req, res) => {
    res.download(path.join(__dirname, "downloads", "clases principales.zip"), "clases principales.zip");
});

module.exports = router;