// import path from "path";
// import multer from "multer";
// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, path.join(__dirname, `../../uploads/investors`));
//     },
//     filename: (req, file, callback) => {
//         const filename = `${file.originalname}`;
//         callback(null, filename);
//     },
// });
// const uploadFiles = multer({ storage: storage }).any();

// export default uploadFiles;

import path from "path";
import multer from "multer";
import fs from "fs";

const uploadFiles = (dir: string, fieldName?: string) => {
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            const filePath = path.join(
                __dirname,
                `../../uploads/${dir}/${req.body.name}`
            );
            if (!fs.existsSync(filePath)) fs.mkdirSync(filePath);
            callback(null, `${filePath}`);
        },
        filename: (req, file, callback) => {
            const filename = `${file.originalname}`;
            callback(null, filename);
        },
    });
    if (fieldName) {
        const uploadFiles = multer({ storage: storage }).array(fieldName);
        return uploadFiles;
    } else {
        const uploadFiles = multer({ storage: storage }).any();
        return uploadFiles;
    }
};

// export default uploadFiles;
export default uploadFiles;
