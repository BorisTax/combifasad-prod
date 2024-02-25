import { dataBaseQuery } from '../functions/other.js';
import messages from '../messages.js';
export default class PriceServiceSQLite {
    dbFile;
    constructor(dbFile) {
        this.dbFile = dbFile;
    }
    async getPriceList() {
        return dataBaseQuery(this.dbFile, "select * from 'pricelist'", { successStatusCode: 200 });
    }
    async updatePriceList({ name, caption, code, id, price, markup }) {
        return dataBaseQuery(this.dbFile, getPriceQuery({ name, caption, code, id, price, markup }), { successStatusCode: 200, successMessage: messages.PRICELIST_UPDATED });
    }
}
function getPriceQuery({ name, caption, code, id, price, markup }) {
    const parts = [];
    if (code)
        parts.push(`code='${code}'`);
    if (caption)
        parts.push(`caption='${caption}'`);
    if (id)
        parts.push(`id='${id}'`);
    if (price)
        parts.push(`price=${price}`);
    if (markup)
        parts.push(`markup=${markup}`);
    const query = parts.length > 0 ? `update pricelist set ${parts.join(', ')} where name='${name}';` : "";
    return query;
}
