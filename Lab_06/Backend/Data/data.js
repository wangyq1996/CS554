const axios = require('axios');
const accessKey = 'AY3f3G-VRS3L8Kx0Cx0BWuoZErXcnaUrOGnKuYuDMHA';

const uuid = require('uuid');

const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on('error', (error) => console.log(error));
client.on('connected', () => console.log('Connected to Redis...'));

const unsplashImages = async (pageNum) => {
    const req = {
        url: `https://api.unsplash.com/photos?client_id=${accessKey}&page=${pageNum}`,
        method: 'GET',
        header: {},
    };

    const res = (await axios(req)).data;

    const output = [];

    res.forEach((e) => {
        const temp = {
            id: e.id,
            url: e.urls.full,
            posterName: e.user.name,
            description: e.alt_description,
            userPosted: false,
            binned: false,
        };
        output.push(temp);
    });

    return output;
};

const binnedImages = async () => {
    const binnedList = await client.lrangeAsync('binned', 0, -1);

    const output = [];

    for (let item of binnedList) {
        const data = await client.getAsync(item);
        output.push(JSON.parse(data));
    }

    // userPostedList.forEach(async (e) => {
    //     const data = await client.getAsync(e);
    //     output.push(data);
    //     //console.log(output);
    // });

    return output;
};

const userPostedImages = async () => {
    const userPostedList = await client.lrangeAsync('userpost', 0, -1);

    const output = [];

    for (let item of userPostedList) {
        const data = await client.getAsync(item);
        output.push(JSON.parse(data));
    }

    // userPostedList.forEach(async (e) => {
    //     const data = await client.getAsync(e);
    //     output.push(data);
    //     //console.log(output);
    // });

    return output;
};

const uploadImage = async (url, description, posterName) => {
    const uploadData = {
        id: uuid.v4(),
        url: url,
        description: description,
        posterName: posterName,
        userPosted: true,
        binned: false,
    };

    const setData = JSON.stringify(uploadData);

    await client.setAsync(uploadData.id, setData);

    await client.rpushAsync('userpost', uploadData.id);

    return uploadData;
};

const updateImage = async (
    id,
    url,
    posterName,
    description,
    userPosted,
    binned
) => {
    const newData = {
        id: id,
        url: url,
        posterName: posterName,
        description: description,
        userPosted: userPosted,
        binned: binned,
    };
    const setData = JSON.stringify(newData);
    let oldData;

    if (userPosted || binned) {
        try {
            oldData = JSON.parse(await client.getAsync(id));
        } catch (e) {
            await client.setAsync(id, setData);

            if (userPosted) await client.rpushAsync('userpost', id);
            if (binned) await client.rpushAsync('binned', id);

            return newData;
        }

        await client.setAsync(id, setData);

        if (oldData.userPosted && !userPosted)
            await client.lremAsync('userpost', 0, id);
        if (oldData.binned && !binned) await client.lremAsync('binned', 0, id);

        if (userPosted && !oldData.userPosted)
            await client.rpushAsync('userpost', id);
        if (binned && !oldData.binned) await client.rpushAsync('binned', id);

        return newData;
    }

    try {
        oldData = JSON.parse(await client.getAsync(id));

        await client.delAsync(id);

        if (oldData.userPosted) await client.lremAsync('userpost', 0, id);
        if (oldData.binned) await client.lremAsync('binned', 0, id);
    } catch (e) {
        throw 'No such id in Redis';
    }

    return newData;
};

const deleteImage = async (id) => {
    let data;

    try {
        data = JSON.parse(await client.getAsync(id));
        if (!data.userPosted) throw 'No Access to non-userPosted Images';
    } catch (e) {
        throw 'No such id';
    }

    await client.delAsync(id);

    await client.lremAsync('userpost', 0, id);

    return data;
};

// async function main() {
//     // uploadImage('1','test1','Yuqi Wang');
//     // uploadImage('2','test2','Yuqi Wang');
//     // uploadImage('3','test3','Yuqi Wang');
//     // uploadImage('4','test4','Yuqi Wang');
//     const res = await updateImage('05ff28a2-7022-425f-902d-f93bb8ec3dcc','update2','Yuqi Wang','Third Update',false,false);
//     console.log(res);
// }

// main();

module.exports = {
    unsplashImages,
    binnedImages,
    userPostedImages,
    uploadImage,
    updateImage,
    deleteImage,
};
