const movie = require('./movie');

const constructorMethod = (app) => {
    app.use('/', movie);
    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
