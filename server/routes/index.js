var express = require("express");
var router = express.Router();
var multer = require("multer");

// 文件上传配置
var upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), function (req, res, next) {
    var file = req.file;

    if (!file) {
        // 如果没有上传文件，返回错误响应
        return res.status(400).json({ error: "No file uploaded" });
    }

    // 在这里进行进一步的文件处理操作

    // 返回成功响应
    return res.status(200).json({ message: "File uploaded successfully" });
});

module.exports = router;
