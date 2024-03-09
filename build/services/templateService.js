export class TemplateService {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    async getTemplates(table) {
        return await this.provider.getTemplates(table);
    }
    async addTemplate(table, template) {
        return await this.provider.addTemplate(table, template);
    }
    async deleteTemplate(table, name) {
        return await this.provider.deleteTemplate(table, name);
    }
    async updateTemplate(table, template) {
        return await this.provider.updateTemplate(table, template);
    }
}
