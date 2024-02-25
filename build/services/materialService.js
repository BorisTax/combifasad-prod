export class MaterialService {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    async getExtMaterials() {
        return await this.provider.getExtMaterials();
    }
    async addExtMaterial({ name, material, image, code }) {
        return await this.provider.addExtMaterial({ name, material, image, code });
    }
    async updateExtMaterial({ name, material, newName, image, code }) {
        return await this.provider.updateExtMaterial({ name, material, newName, image, code });
    }
    async deleteExtMaterial(name, material) {
        return await this.provider.deleteExtMaterial(name, material);
    }
    async getProfiles() {
        return await this.provider.getProfiles();
    }
    async addProfile(profile) {
        return await this.provider.addProfile(profile);
    }
    async deleteProfile(name, type) {
        return await this.provider.deleteProfile(name, type);
    }
    async updateProfile(profile) {
        return await this.provider.updateProfile(profile);
    }
}
