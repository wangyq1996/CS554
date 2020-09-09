const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;
const ObjID = require('mongodb').ObjectID;

const getAllMovies = async (skip = 0, take = 20) => {
    if (take <= 0) return [];
    const movieCollection = await movies();
    return await movieCollection
        .find({})
        .skip(skip)
        .limit(Math.min(take, 100))
        .toArray();
};

const getMovieById = async (id) => {
    const movieCollection = await movies();
    const movie = await movieCollection.findOne({ _id: ObjID(id) });

    if (!movie) throw 'No movie found';
    return movie;
};

const addMovie = async (title, cast, info, plot, rating) => {
    if (typeof title !== 'string') throw 'Invalid Title';

    if (!Array.isArray(cast)) throw 'Invalid Cast';
    for (let i of cast) {
        if (typeof i !== 'object') throw 'Invalid Cast Content';
    }

    if (typeof info !== 'object') throw 'Invalid Info';

    if (typeof plot !== 'string') throw 'Invalid Plot';

    if (typeof rating !== 'number') throw 'Invalid Rating';

    const movieCollection = await movies();

    const newMovie = {
        title: title,
        cast: cast,
        info: info,
        plot: plot,
        rating: rating,
        comments: [],
    };

    const insertMovie = await movieCollection.insertOne(newMovie);
    if (insertMovie.insertedCount === 0) throw 'Insert Failed';
    const newId = insertMovie.insertedId.toString();

    return await getMovieById(newId);
};

const updateMovie = async (id, title, cast, info, plot, rating) => {
    const movie = await getMovieById(id);
    const comments = movie.comments;

    const newMovie = {
        title: title,
        cast: cast,
        info: info,
        plot: plot,
        rating: rating,
        comments: comments,
    };

    const movieCollection = await movies();
    const updateInfo = await movieCollection.updateOne(
        { _id: ObjID(id) },
        { $set: newMovie }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw 'Update Failed';

    return await getMovieById(id);
};

const removeMovie = async (id) => {
    const movieCollection = await movies();
    const deleteionInfo = await movieCollection.removeOne({ _id: ObjID(id) });
    if (deleteionInfo.deletedCount == 0) throw 'Deleteion Failed';
    return true;
};

module.exports = {
    getAllMovies,
    getMovieById,
    addMovie,
    updateMovie,
    removeMovie,
};
