const Commerce = require('../models/store');

module.exports = function storeFormatter(d) {
    return async function (q, sort, page, limit) {
      let data = await d(q, sort, page, limit);
      data = data.map(element => {
        let dataFormatter = {
          id: element.id,
          active: element.active ? 'Si' : 'No',
          cuit: element.cuit,
          currentBalance: element.currentBalance,
          name: element.name,
          lastSale: element.lastSale
        };
        element.concepts.forEach((value, index) => {
          dataFormatter['concept' + index] = value;
        });
        return dataFormatter;
      });
      const total = await Commerce.countDocuments(q);
      const pages = Math.ceil(total / limit);
      return {
        data,
        page,
        pages,
        limit,
        total
      };
    };
  };