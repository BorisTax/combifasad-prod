import fs from 'fs';
import bcrypt from "bcrypt";
import sqlite3 from "sqlite3";
import messages from './messages.js';
export function dataBaseQuery(dbFile, query, { successStatusCode = 200, errorStatusCode = 500, successMessage = messages.NO_ERROR, }) {
    return new Promise((resolve) => {
        const db = new sqlite3.Database(dbFile, (err) => {
            if (err) {
                resolve({ success: false, status: errorStatusCode, message: messages.DATABASE_OPEN_ERROR, error: err });
                db.close();
                return;
            }
            if (!query) {
                resolve({ success: false, status: errorStatusCode, message: messages.SQL_QUERY_ERROR });
                db.close();
                return;
            }
            db.all(query, (err, rows) => {
                if (err) {
                    resolve({ success: false, status: errorStatusCode, message: messages.SQL_QUERY_ERROR, error: err });
                    db.close();
                }
                else {
                    resolve({ success: true, status: successStatusCode, data: rows, message: successMessage });
                }
                db.close();
            });
        });
    });
}
export async function moveFile(sourcefile, destfile) {
    const result = { copy: false, delete: false };
    return new Promise((resolve) => {
        fs.copyFile(sourcefile, destfile, function (err) {
            if (err)
                resolve(result);
            else {
                result.copy = true;
                fs.unlink(sourcefile, (err) => {
                    if (err)
                        resolve(result);
                    else {
                        result.delete = true;
                        resolve(result);
                    }
                });
            }
        });
    });
}
export const checkPermissions = (req, res, roles) => {
    if (!roles.some(r => r === req.userRole)) {
        res.status(403).json({ success: false, message: messages.ACCESS_DENIED });
        return false;
    }
    return true;
};
export function hashData(data) {
    return new Promise((resolve) => {
        bcrypt.hash(data, 10, (err, hash) => {
            if (err)
                resolve({ success: false, status: 500, error: err });
            else
                resolve({ success: true, status: 200, data: hash });
        });
    });
}
export function incorrectData(message) {
    return { success: false, status: 400, message };
}
export function noExistData(message) {
    return { success: false, status: 404, message };
}
export function accessDenied(res) {
    res.status(403).json({ success: false, message: messages.ACCESS_DENIED });
}
