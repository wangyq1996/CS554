import md5 from 'blueimp-md5';
import axios from 'axios';


const getData = async (port, type, props) => {
    const publickey = '663a584b1b8bf44b1b7b6cad2ddb4904';
    const privatekey = 'fafff261040b40ca84b179013046e053747411bc';
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    
    let baseUrl;
    let url;

    if(type === 'id') {
        baseUrl = `https://gateway.marvel.com:443/v1/public/${port}/${props}`;
        url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
    } else if (type === 'page') {
        const offset = props*20;
        baseUrl = `https://gateway.marvel.com:443/v1/public/${port}?offset=${offset}`;
        url = baseUrl + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
    } else if (type === 'search') {
        baseUrl = `https://gateway.marvel.com:443/v1/public/${port}?name=${props}`;
        url = baseUrl + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
    } else throw 'Invalid getdata call';

    try {
        const data = await (await axios (url)).data.data;
        if(data.total === 0|| data.count === 0) return 'No data Found';
        return data;
    } catch (e) {
        return 'Error';
    }
};

export default getData;