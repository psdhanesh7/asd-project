const multer = require("multer");

const excelFilter = (req, file, cb) => {
    if (file.mimetype.includes("excel") || file.mimetype.includes("spreadsheetml")) {
        cb(null, true);
    } else {
        cb("Please upload only excel file.", false);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/public/static/assets/uploads")
    },
    filename: (req, file, cb) => {
        // console.log(file.originalname);
        // console.log(file.mimetype);
        cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
    },
});

const uploadFile = multer({ storage: storage, fileFilter: excelFilter });

module.exports = uploadFile;