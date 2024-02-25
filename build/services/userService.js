import messages from '../messages.js';
import { userServiceProvider } from '../options.js';
import { SERVER_EVENTS } from '../types/enums.js';
export const activeTokens = { tokenList: [] };
export const events = new Map();
export async function getTokens() {
    const userService = new UserService(userServiceProvider);
    const result = await userService.getTokens();
    if (result.success)
        return result.data;
    return [];
}
Promise.resolve().then(() => getTokens().then(r => activeTokens.tokenList = r));
const expiredInterval = 3600 * 24 * 1000;
const clearExpiredTokens = () => {
    const userService = new UserService(userServiceProvider);
    activeTokens.tokenList.forEach((t) => {
        if (Date.now() - t.time > expiredInterval)
            userService.deleteToken(t.token);
    });
};
setInterval(clearExpiredTokens, 60000);
export function notifyActiveUsers() {
    events.forEach(emitter => emitter.emit('message', SERVER_EVENTS.UPDATE_ACTIVE_USERS));
}
export function logoutUser(token) {
    events.forEach(emitter => emitter.emit('message', SERVER_EVENTS.LOGOUT, token));
}
export class UserService {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    async getUsers() {
        return await this.provider.getUsers();
    }
    async getUser(token) {
        const tokenList = await this.getTokens();
        if (!tokenList.success)
            return undefined;
        const userList = await this.getUsers();
        if (!userList.success)
            return undefined;
        const foundToken = tokenList.data.find(t => t.token === token);
        const userName = foundToken && foundToken.username;
        const user = userList.data.find(u => u.name === userName);
        return user;
    }
    async getTokens() {
        return await this.provider.getTokens();
    }
    async addToken({ token, userName }) {
        const time = Date.now();
        const result = await this.provider.addToken({ token, userName, time });
        if (result.success)
            activeTokens.tokenList.push({ token, username: userName, time });
        return result;
    }
    async deleteToken(token, extAction = () => { notifyActiveUsers(); }) {
        const result = await this.provider.deleteToken(token);
        if (result.success) {
            activeTokens.tokenList = activeTokens.tokenList.filter(t => t.token !== token);
            extAction();
            events.delete(token);
        }
        return result;
    }
    async clearAllTokens() {
        const result = await this.provider.clearAllTokens();
        if (result.success)
            activeTokens.tokenList = [];
        return result;
    }
    async registerUser(user) {
        const result = await this.isUserNameExist(user.name);
        if (!result.success)
            return result;
        return this.provider.registerUser(user);
    }
    async deleteUser(user) {
        const result = await this.provider.deleteUser(user);
        if (result.success) {
            const t = activeTokens.tokenList.find(t => t.username === user.name);
            if (t)
                await this.deleteToken(t.token, () => { logoutUser(t.token); });
        }
        return result;
    }
    async isUserNameExist(name) {
        if (!name)
            return { success: false, status: 400, message: messages.INVALID_USER_DATA };
        const result = await this.getUsers();
        if (!result.success)
            return result;
        const userList = result.data || [];
        const user = userList.find(u => u.name === name);
        if (user)
            return { success: false, status: 409, message: messages.USER_NAME_EXIST };
        return { success: true, status: 200, message: messages.USER_NAME_ALLOWED };
    }
}
