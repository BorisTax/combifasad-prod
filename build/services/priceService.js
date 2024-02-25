export class PriceService {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    async getPriceList() {
        return await this.provider.getPriceList();
    }
    async updatePriceList(item) {
        return await this.provider.updatePriceList(item);
    }
}
