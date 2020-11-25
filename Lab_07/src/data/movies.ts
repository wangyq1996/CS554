import * as Mongo from 'mongodb';
import { ObjectId } from 'mongodb';

const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;
const ObjID = require('mongodb').ObjectID;

interface Movie {
    id: ObjectId;
    title: string;
    cast: Array<castItem>;
    info: info;
    plot: string;
    rating: number;
    comments: Array<Comment>;
}

interface Comment {
    name: string;
    comment: string;
}

interface info {
    director: string;
    yearReleased: number;
}

interface castItem {
    firstName: string;
    lastName: string;
}

interface newMovie {
    title: string;
    cast: Array<castItem>;
    info: info;
    plot: string;
    rating: number;
    comments: Array<Comment>;
}

const getAllMovies = async (
    skip: number = 0,
    take: number = 20
): Promise<Array<Movie>> => {
    if (take <= 0) return [];
    const movieCollection: Mongo.Collection = await movies();
    try {
        const output: Array<Movie> = await movieCollection
            .find({})
            .skip(skip)
            .limit(Math.min(take, 100))
            .toArray();
        return output;
    } catch (e) {
        throw 'Error';
    }
};

const getMovieById = async (id: string): Promise<Movie> => {
    const movieCollection: Mongo.Collection = await movies();
    const movie: Movie = await movieCollection.findOne({ _id: ObjID(id) });

    if (!movie) throw 'No movie found';
    return movie;
};

const addMovie = async (
    title: string,
    cast: Array<castItem>,
    info: info,
    plot: string,
    rating: number
): Promise<Movie> => {
    for (let item of cast) {
        if (item.firstName.length <= 0 || item.lastName.length <= 0)
            throw 'Invalid cast item';
    }
    if (info.yearReleased % 1 !== 0 || info.yearReleased < 0)
        throw 'Invalid released year info';

    if (rating < 0) throw 'Invalid Rating';

    const movieCollection: Mongo.Collection = await movies();

    const newMovie: newMovie = {
        title: title,
        cast: cast,
        info: info,
        plot: plot,
        rating: rating,
        comments: [],
    };

    const insertMovie = await movieCollection.insertOne(newMovie);
    if (insertMovie.insertedCount === 0) throw 'Insert Failed';
    const newId: string = insertMovie.insertedId.toString();

    return await getMovieById(newId);
};

const updateMovie = async (
    id: string,
    title: string,
    cast: Array<castItem>,
    info: info,
    plot: string,
    rating: number
): Promise<Movie> => {
    for (let item of cast) {
        if (item.firstName.length <= 0 || item.lastName.length <= 0)
            throw 'Invalid cast item';
    }
    if (info.yearReleased % 1 !== 0 || info.yearReleased < 0)
        throw 'Invalid released year info';

    if (rating < 0) throw 'Invalid Rating';

    const movie: Movie = await getMovieById(id);
    const comments: Array<Comment> = movie.comments;

    const newMovie: newMovie = {
        title: title,
        cast: cast,
        info: info,
        plot: plot,
        rating: rating,
        comments: comments,
    };

    const movieCollection: Mongo.Collection = await movies();
    const updateInfo = await movieCollection.updateOne(
        { _id: ObjID(id) },
        { $set: newMovie }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw 'Update Failed';

    return await getMovieById(id);
};

const removeMovie = async (id: string): Promise<Boolean> => {
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
