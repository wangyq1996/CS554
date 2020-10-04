const fetch = require('node-fetch');

const getList = async () => {
    const req = {
        method: 'GET',
        headers: {},
    };

    const res = await fetch('http://api.tvmaze.com/shows', req);

    const data = await res.json();

    console.log(data.length);

    return data;
};

const getId = async (id) => {
    const req = {
        method: 'GET',
        headers: {},
    };

    const res = await fetch(`http://api.tvmaze.com/shows/${id}`, req);

    const data = await res.json();

    return data;
};

const getQuery = async (query) => {
    const req = {
        method: 'GET',
        headers: {},
    };

    const res = await fetch(
        `http://api.tvmaze.com/search/shows?q=${query}`,
        req
    );

    const data = await res.json();

    console.log(data);
};

module.exports = {
    getList,
    getId,
    getQuery,
}