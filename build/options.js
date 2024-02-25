import fs from 'fs';
import { UserService } from './services/userService.js';
import UserServiceSQLite from './services/userServiceSQLite.js';
import MaterialServiceSQLite from './services/materialServiceSQLite.js';
import path from 'path';
import { fileURLToPath } from 'url';
import PriceServiceSQLite from './services/priceServiceSQLite.js';
export const JWT_SECRET = "secretkey";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersPath = path.resolve(__dirname, 'database/users.db');
const materialsPath = path.resolve(__dirname, 'database/materials.db');
const pricePath = path.resolve(__dirname, 'database/prices.db');
export const userServiceProvider = new UserServiceSQLite(usersPath);
export const materialServiceProvider = new MaterialServiceSQLite(materialsPath);
export const priceServiceProvider = new PriceServiceSQLite(pricePath);
export const userRoleParser = async (req, res, next) => {
    const userService = new UserService(userServiceProvider);
    let token = req.query.token;
    token = req.body.token || token || "";
    req.token = token;
    const user = await userService.getUser(token);
    if (user) {
        req.userRole = user.role;
    }
    next();
};
function readFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}
