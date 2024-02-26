import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import express from "express";
import { accessDenied } from '../functions/other.js';
import { isAdminAtLeast } from '../functions/user.js';
import { databaseFolder, databaseZipFile } from '../options.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
export default router;
router.get("/download", async (req, res) => {
    if (!isAdminAtLeast(req.userRole))
        return accessDenied(res);
    const result = await zipDirectory(databaseFolder, databaseZipFile);
    if (result.success)
        res.download(databaseZipFile, 'database.zip');
});
function zipDirectory(sourceDir, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(outPath);
    return new Promise((resolve) => {
        archive.directory(sourceDir, false).on('error', err => resolve({ success: false, status: 500 })).pipe(stream);
        stream.on('close', () => resolve({ success: true, status: 200 }));
        archive.finalize();
    });
}
