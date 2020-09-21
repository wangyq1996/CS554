const movieRoutes = require('./movies');

const constructorMethod = (app) => {
    app.use('/', movieRoutes);

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
