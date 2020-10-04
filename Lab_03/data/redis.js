const redis = require('redis');
const client = redis.createClient();

//client.on('error', error => console.error(error));
client.on('connected', () => console.log('Connected to Redis...'));

const existKey = (key) => {
    client.exists(key, (err,res) => {
        if(err) throw err;
        if(res === '0') return false;
        return true;
    });
};

const setData = (data) => {
    const id = data.id;
    
    client.hmset(, (err, res) => {
        if(err) throw err;
        //return res;
    });
};

const getData = (key) => {
    client.get(key, (err, res) => {
        if(err) throw err;
        console.log(res);
    });

    //if (data === 'nil') return false;

    //client.set(key, [data[0], data[1]++]);

    //return data;
};

setData('1', '123');
getData('1');
