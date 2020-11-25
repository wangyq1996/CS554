const dbConnection: any = require('./mongoConnection');

function getCollectionFn(collection: any) {
    let _col: any = undefined;

    return async () => {
        if (!_col) {
            const db: any = await dbConnection();
            _col = await db.collection(collection);
        }

        return _col;
    };
}

module.exports = {
    movies: getCollectionFn('movies'),
    comments: getCollectionFn('comments'),
};
