import { dataBaseQuery } from '../functions/other.js';
import messages from '../messages.js';
export default class TemplateServiceSQLite {
    dbFile;
    constructor(dbFile) {
        this.dbFile = dbFile;
    }
    async getTemplates(table) {
        return dataBaseQuery(this.dbFile, `select * from ${table}`, { successStatusCode: 200 });
    }
    async addTemplate(table, { name, data }) {
        return dataBaseQuery(this.dbFile, `insert into ${table} (name, data) values('${name}', '${data}');`, { successStatusCode: 201, successMessage: messages.TEMPLATE_ADDED });
    }
    async deleteTemplate(table, name) {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${table} WHERE name='${name}';`, { successStatusCode: 200, successMessage: messages.TEMPLATE_DELETED });
    }
    async updateTemplate(table, { newName, name, data }) {
        return dataBaseQuery(this.dbFile, getQuery(table, { newName, name, data }), { successStatusCode: 200, successMessage: messages.TEMPLATE_UPDATED });
    }
}
function getQuery(table, { newName, name, data }) {
    const parts = [];
    if (newName)
        parts.push(`name='${newName}'`);
    if (data)
        parts.push(`data='${data}'`);
    const query = parts.length > 0 ? `update ${table} set ${parts.join(', ')} where name='${name}';` : "";
    return query;
}
