import { dataBaseQuery } from '../functions/other.js';
import messages from '../messages.js';
export default class MaterialServiceSQLite {
    dbFile;
    constructor(dbFile) {
        this.dbFile = dbFile;
    }
    async getExtMaterials() {
        return dataBaseQuery(this.dbFile, "select * from 'extmaterials' order by material, name;", { successStatusCode: 200 });
    }
    async addExtMaterial({ name, material, image, code }) {
        return dataBaseQuery(this.dbFile, `insert into extmaterials (name, material, image, code) values('${name}', '${material}', '${image}', '${code}');`, { successStatusCode: 201, successMessage: messages.MATERIAL_ADDED });
    }
    async updateExtMaterial({ name, material, newName, image, code }) {
        return dataBaseQuery(this.dbFile, getQuery({ newName, image, code, name, material }), { successStatusCode: 200, successMessage: messages.MATERIAL_UPDATED });
    }
    async deleteExtMaterial(name, material) {
        return dataBaseQuery(this.dbFile, `DELETE FROM extmaterials WHERE name='${name}' and material='${material}';`, { successStatusCode: 200, successMessage: messages.MATERIAL_DELETED });
    }
    async getProfiles() {
        return dataBaseQuery(this.dbFile, `select * from 'profileColors'`, { successStatusCode: 200 });
    }
    async addProfile({ name, code, type }) {
        return dataBaseQuery(this.dbFile, `insert into profilecolors (name, type, code) values('${name}', '${type}', '${code}');`, { successStatusCode: 201, successMessage: messages.PROFILE_ADDED });
    }
    async deleteProfile(name, type) {
        return dataBaseQuery(this.dbFile, `DELETE FROM profilecolors WHERE name='${name}' and type='${type}';`, { successStatusCode: 200, successMessage: messages.PROFILE_DELETED });
    }
    async updateProfile({ newName, code, type, name }) {
        return dataBaseQuery(this.dbFile, getProfileQuery({ newName, code, name, type }), { successStatusCode: 200, successMessage: messages.PROFILE_UPDATED });
    }
}
function getQuery({ newName, image, code, name, material }) {
    const parts = [];
    if (newName)
        parts.push(`name='${newName}'`);
    if (image)
        parts.push(`image='${image || ""}'`);
    if (code)
        parts.push(`code='${code}'`);
    const query = parts.length > 0 ? `update extmaterials set ${parts.join(', ')} where name='${name}' and material='${material}';` : "";
    return query;
}
function getProfileQuery({ newName, code, name, type }) {
    const parts = [];
    if (newName)
        parts.push(`name='${newName}'`);
    if (code)
        parts.push(`code='${code}'`);
    if (type)
        parts.push(`type='${type}'`);
    const query = parts.length > 0 ? `update profilecolors set ${parts.join(', ')} where name='${name}';` : "";
    return query;
}
