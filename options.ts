import fs from 'fs'
import { UserService } from './services/userService.js'
import { MyRequest, RequestBody } from './types/server.js'
import { Response, NextFunction } from "express"
import UserServiceSQLite from './services/userServiceSQLite.js'
import MaterialServiceSQLite from './services/materialServiceSQLite.js'
import path from 'path'
import { fileURLToPath } from 'url'
import PriceServiceSQLite from './services/priceServiceSQLite.js'
import TemplateServiceSQLite from './services/templateServiceSQLite.js'

export const JWT_SECRET = "secretkey"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const databaseZipFile = path.resolve(__dirname, 'database.zip')
export const databaseFolder = path.resolve(__dirname, 'database')
const usersPath = path.resolve(__dirname, 'database/users.db')
const materialsPath = path.resolve(__dirname, 'database/materials.db')
const pricePath = path.resolve(__dirname, 'database/prices.db')
const templatePath = path.resolve(__dirname, 'database/templates.db')
export const userServiceProvider = new UserServiceSQLite(usersPath)
export const materialServiceProvider = new MaterialServiceSQLite(materialsPath)
export const priceServiceProvider = new PriceServiceSQLite(pricePath)
export const templateServiceProvider = new TemplateServiceSQLite(templatePath)

export const userRoleParser = async (req: MyRequest, res: Response, next: NextFunction) => {
  const userService = new UserService(userServiceProvider)
  let token = req.query.token as string
  token = (req.body as RequestBody).token || token || ""
  req.token = token
  const user = await userService.getUser(token)
  if (user) {
    req.userRole = user.role
  }
  next()
}

function readFile(file: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) reject(err); else resolve(data);
    })
  })
}

