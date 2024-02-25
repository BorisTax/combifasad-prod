import { dataBaseQuery, hashData } from '../functions/other.js';
import messages from '../messages.js';
export default class UserServiceSQLite {
    dbFile;
    constructor(dbFile) {
        this.dbFile = dbFile;
    }
    async getUsers() {
        return dataBaseQuery(this.dbFile, "select * from 'users'", { successStatusCode: 200 });
    }
    async getTokens() {
        return dataBaseQuery(this.dbFile, "select * from 'tokens'", { successStatusCode: 200 });
    }
    async addToken({ token, userName, time }) {
        return dataBaseQuery(this.dbFile, `INSERT INTO tokens (token, username, time) VALUES('${token}', '${userName}', ${time})`, { successStatusCode: 201 });
    }
    async deleteToken(token) {
        return dataBaseQuery(this.dbFile, `DELETE FROM tokens WHERE token='${token}'`, { successStatusCode: 200 });
    }
    async clearAllTokens() {
        return dataBaseQuery(this.dbFile, `DELETE FROM tokens`, { successStatusCode: 200 });
    }
    async registerUser(user) {
        const result = await hashData(user.password);
        return dataBaseQuery(this.dbFile, `INSERT INTO users (name, role, password) VALUES('${user.name}', '${user.role}', '${result.data}')`, { successStatusCode: 201, successMessage: messages.USER_ADDED });
    }
    async deleteUser(user) {
        return dataBaseQuery(this.dbFile, `DELETE FROM users where name='${user.name}';`, { successStatusCode: 200, successMessage: messages.USER_DELETED });
    }
}
