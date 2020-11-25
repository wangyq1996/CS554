"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;
const ObjID = require('mongodb').ObjectID;
const getAllMovies = (skip = 0, take = 20) => __awaiter(void 0, void 0, void 0, function* () {
    if (take <= 0)
        return [];
    const movieCollection = yield movies();
    try {
        const output = yield movieCollection
            .find({})
            .skip(skip)
            .limit(Math.min(take, 100))
            .toArray();
        return output;
    }
    catch (e) {
        throw 'Error';
    }
});
const getMovieById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const movieCollection = yield movies();
    const movie = yield movieCollection.findOne({ _id: ObjID(id) });
    if (!movie)
        throw 'No movie found';
    return movie;
});
const addMovie = (title, cast, info, plot, rating) => __awaiter(void 0, void 0, void 0, function* () {
    for (let item of cast) {
        if (item.firstName.length <= 0 || item.lastName.length <= 0)
            throw 'Invalid cast item';
    }
    if (info.yearReleased % 1 !== 0 || info.yearReleased < 0)
        throw 'Invalid released year info';
    if (rating < 0)
        throw 'Invalid Rating';
    const movieCollection = yield movies();
    const newMovie = {
        title: title,
        cast: cast,
        info: info,
        plot: plot,
        rating: rating,
        comments: [],
    };
    const insertMovie = yield movieCollection.insertOne(newMovie);
    if (insertMovie.insertedCount === 0)
        throw 'Insert Failed';
    const newId = insertMovie.insertedId.toString();
    return yield getMovieById(newId);
});
const updateMovie = (id, title, cast, info, plot, rating) => __awaiter(void 0, void 0, void 0, function* () {
    for (let item of cast) {
        if (item.firstName.length <= 0 || item.lastName.length <= 0)
            throw 'Invalid cast item';
    }
    if (info.yearReleased % 1 !== 0 || info.yearReleased < 0)
        throw 'Invalid released year info';
    if (rating < 0)
        throw 'Invalid Rating';
    const movie = yield getMovieById(id);
    const comments = movie.comments;
    const newMovie = {
        title: title,
        cast: cast,
        info: info,
        plot: plot,
        rating: rating,
        comments: comments,
    };
    const movieCollection = yield movies();
    const updateInfo = yield movieCollection.updateOne({ _id: ObjID(id) }, { $set: newMovie });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw 'Update Failed';
    return yield getMovieById(id);
});
const removeMovie = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const movieCollection = yield movies();
    const deleteionInfo = yield movieCollection.removeOne({ _id: ObjID(id) });
    if (deleteionInfo.deletedCount == 0)
        throw 'Deleteion Failed';
    return true;
});
module.exports = {
    getAllMovies,
    getMovieById,
    addMovie,
    updateMovie,
    removeMovie,
};
