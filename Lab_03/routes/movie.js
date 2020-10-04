const express = require('express');
const router = express.Router();

const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();

const data = require('../data/data');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on('error', (error) => console.log(error));
client.on('connected', () => console.log('Connected to Redis...'));

router.get('/', async (req, res) => {
    let homePage = await client.getAsync('homePage');
    if (!homePage) {
        const allData = await data.getList();
        res.render(
            'view/home',
            {
                layout: 'main',
                title: 'Home Page',
                allData: allData,
            },
            async (err, html) => {
                await client.setAsync('homePage', html.toString());
                res.send(html);
            }
        );
        return;
    }
    res.send(homePage);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    let detailPage = await client.getAsync(id);
    if (!detailPage) {
        const detail = await data.getId(id);
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
        return;
    }
    res.send(detailPage);
});

module.exports = router;
