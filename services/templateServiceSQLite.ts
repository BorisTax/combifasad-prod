import { Results } from '../types/server.js';
import { ITemplateServiceProvider } from '../types/services.js';
import { dataBaseQuery } from '../functions/other.js';
import messages from '../messages.js';
import { NewTemplate, Template } from '../types/templates.js';
export default class TemplateServiceSQLite implements ITemplateServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }

    async getTemplates(table: string): Promise<Results> {
        return dataBaseQuery(this.dbFile, `select * from ${table}`, {successStatusCode: 200})
    }
    async addTemplate(table: string, { name, data }: Template) {
        return dataBaseQuery(this.dbFile, `insert into ${table} (name, data) values('${name}', '${data}');`, {successStatusCode: 201, successMessage: messages.TEMPLATE_ADDED})
    }
    async deleteTemplate(table: string, name: string) {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${table} WHERE name='${name}';`, {successStatusCode: 200, successMessage: messages.TEMPLATE_DELETED})
    }
    async updateTemplate(table: string, { newName, name, data }: NewTemplate) {
        return dataBaseQuery(this.dbFile, getQuery(table, { newName, name, data }), {successStatusCode: 200, successMessage: messages.TEMPLATE_UPDATED})
    }
}

function getQuery(table: string, { newName, name, data }: NewTemplate) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (data) parts.push(`data='${data}'`)
    const query = parts.length > 0 ? `update ${table} set ${parts.join(', ')} where name='${name}';` : ""
    return query
}



