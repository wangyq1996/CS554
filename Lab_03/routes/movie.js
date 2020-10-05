const express = require('express');
const router = express.Router();

const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();

const data = require('../data/data');
const e = require('express');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on('error', (error) => console.log(error));
client.on('connected', () => console.log('Connected to Redis...'));

router.get('/', async (req, res) => {
    const homePage = await client.getAsync('homePage');
    if (!homePage) {
        const allData = await data.getList();
        res.render(
            'view/home',
            {
                layout: 'main',
                title: 'Home Page',
                token: false,
                allData: allData,
            },
            async (err, html) => {
                await client.setAsync('homePage', html.toString());
                res.send(html);
            }
        );
    } else res.send(homePage);
});

router.get('/popularsearches', async (req, res) => {
    try {
        const top10 = await client.zrevrangeAsync('popSearch', 0, 9);
        res.render('view/popular', {
            layout: 'main',
            title: 'Top 10 Searches',
            top10: top10,
        });
    } catch (e) {
        res.render('view/error', { layout: 'main', title: 'Error!' });
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const detailPage = await client.getAsync(id);
    if (!detailPage) {
        try {
            const detail = await data.getId(id);
            if (!detail) {
                res.render('view/error', { layout: 'main', title: 'Error!' });
            } else {
                res.render(
                    'view/detail',
                    {
                        layout: 'main',
                        title: `${detail.name}`,
                        detail: detail,
                    },
                    async (err, html) => {
                        await client.setAsync(id, html.toString());
                        res.send(html);
                    }
                );
            }
        } catch (e) {
            res.render('view/error', { layout: 'main', title: 'Error!' });
        }
    } else res.send(detailPage);
});

router.post('/search', async (req, res) => {
    const query = req.body.query;
    if (!queryCheck(query)) {
        res.render('view/error', { layout: 'main', title: 'Error!' });
    } else {
        const searchPage = await client.getAsync(query);
        if (!searchPage) {
            try {
                let allData = await data.getQuery(query);
                for (let i = 0; i < allData.length; i++) {
                    allData[i] = allData[i].show;
                }
                res.render(
                    'view/home',
                    {
                        layout: 'main',
                        title: `Result for '${query}'`,
                        token: true,
                        allData: allData,
                    },
                    async (err, html) => {
                        await client.setAsync(query, html.toString());
                        await client.zaddAsync('popSearch', 1, query);
                        res.send(html);
                    }
                );
            } catch (e) {
                res.render('view/error', { layout: 'main', title: 'Error!' });
            }
        } else {
            const val = await client.zscoreAsync('popSearch', query);
            await client.zaddAsync('popSearch', parseInt(val) + 1, query);
            res.send(searchPage);
        }
    }
});

const queryCheck = (query) => {
    const check = /[a-z]/i;
    return check.test(query);
};

module.exports = router;
