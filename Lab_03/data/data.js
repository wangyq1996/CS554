const axios = require('axios');

const getList = async () => {
    const req = {
        url: 'http://api.tvmaze.com/shows',
        method: 'GET',
        headers: {},
    };

    const res = await axios(req);

    let abbData = [];

    for (i of res.data) {
        abbData.push({
            id: i.id,
            name: i.name,
        });
    }

    return abbData;
};

const getId = async (id) => {
    const req = {
        url: `http://api.tvmaze.com/shows/${id}`,
        method: 'GET',
        headers: {},
    };

    const res = await axios(req);

    return res.data;
};

const getQuery = async (query) => {
    const req = {
        url: `http://api.tvmaze.com/search/shows?q=${query}`,
        method: 'GET',
        headers: {},
    };

    const res = await axios(req);

    return res.data;
};

module.exports = {
    getList,
    getId,
    getQuery,
};
