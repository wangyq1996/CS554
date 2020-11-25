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
const express = require("express");
const data = require('./data');
const movieData = data.movies;
const commentData = data.comments;
class App {
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    config() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        let reqCount = 0;
        this.app.use(function (req, res, next) {
            reqCount++;
            console.log('Number of Requests:' + reqCount);
            next();
        });
        this.app.use(function (req, res, next) {
            console.log('Request Body:', req.body);
            next();
        }, function (req, res, next) {
            console.log('Request URL:', req.originalUrl);
            next();
        }, function (req, res, next) {
            console.log('Request Type:', req.method);
            next();
        });
        let json = {};
        this.app.use(function (req, res, next) {
            if (!json[req.originalUrl])
                json[req.originalUrl] = 0;
            json[req.originalUrl]++;
            console.log(req.originalUrl +
                ' has been requested ' +
                json[req.originalUrl] +
                ' times.');
            next();
        });
    }
    routes() {
        const router = express.Router();
        router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const skip = Number.parseInt(req.query.skip ? req.query.skip.toString() : '0');
            const take = Number.parseInt(req.query.take ? req.query.take.toString() : '20');
            if (Number.isNaN(skip) || skip < 0 || Number.isNaN(take)) {
                res.status(400).json({ error: 'Invalid Query Input' });
                return;
            }
            try {
                const movieList = yield movieData.getAllMovies(skip, take);
                res.json(movieList);
            }
            catch (e) {
                res.sendStatus(400);
            }
        }));
        router.get('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const movie = yield movieData.getMovieById(req.params.id);
                res.json(movie);
            }
            catch (e) {
                res.status(404).json({ error: 'Movie Not Found' });
            }
        }));
        router.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const movieInfo = req.body;
            if (!movieInfo) {
                res.status(400).json({ error: 'No Movie Data Provided' });
                return;
            }
            if (!movieInfo.title || typeof movieInfo.title !== 'string') {
                res.status(400).json({ error: 'Invalid Movie Title' });
                return;
            }
            if (!movieInfo.cast || !Array.isArray(movieInfo.cast)) {
                res.status(400).json({ error: 'Invalid Movie Cast' });
                return;
            }
            for (let i of movieInfo.cast) {
                if (typeof i !== 'object' ||
                    !i.firstName ||
                    !i.lastName ||
                    typeof i.firstName !== 'string' ||
                    typeof i.lastName !== 'string') {
                    res.status(400).json({
                        error: 'Invalid Movie Cast Content',
                    });
                    return;
                }
            }
            if (!movieInfo.info ||
                typeof movieInfo.info !== 'object' ||
                typeof movieInfo.info.director !== 'string' ||
                typeof movieInfo.info.yearReleased !== 'number' ||
                movieInfo.info.yearReleased % 1 !== 0 ||
                movieInfo.info.yearReleased < 0) {
                res.status(400).json({ error: 'Invalid Movie Info' });
                return;
            }
            if (!movieInfo.plot || typeof movieInfo.plot !== 'string') {
                res.status(400).json({ error: 'Invalid Movie Plot' });
                return;
            }
            if (movieInfo.rating === undefined ||
                typeof movieInfo.rating !== 'number') {
                res.status(400).json({ error: 'Invalid Movie Rating' });
                return;
            }
            try {
                const newMovie = yield movieData.addMovie(movieInfo.title, movieInfo.cast, movieInfo.info, movieInfo.plot, movieInfo.rating);
                res.json(newMovie);
            }
            catch (e) {
                res.sendStatus(400);
            }
        }));
        router.put('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const movieInfo = req.body;
            if (!movieInfo) {
                res.status(400).json({ error: 'No Movie Data Provided' });
                return;
            }
            if (!movieInfo.title || typeof movieInfo.title !== 'string') {
                res.status(400).json({ error: 'Invalid Movie Title' });
                return;
            }
            if (!movieInfo.cast || !Array.isArray(movieInfo.cast)) {
                res.status(400).json({ error: 'Invalid Movie Cast' });
                return;
            }
            for (let i of movieInfo.cast) {
                if (typeof i !== 'object' ||
                    !i.firstName ||
                    !i.lastName ||
                    typeof i.firstName !== 'string' ||
                    typeof i.lastName !== 'string') {
                    res.status(400).json({
                        error: 'Invalid Movie Cast Content',
                    });
                    return;
                }
            }
            if (!movieInfo.info ||
                typeof movieInfo.info !== 'object' ||
                typeof movieInfo.info.director !== 'string' ||
                typeof movieInfo.info.yearReleased !== 'number' ||
                movieInfo.info.yearReleased % 1 !== 0 ||
                movieInfo.info.yearReleased < 0) {
                res.status(400).json({ error: 'Invalid Movie Info' });
                return;
            }
            if (!movieInfo.plot || typeof movieInfo.plot !== 'string') {
                res.status(400).json({ error: 'Invalid Movie Plot' });
                return;
            }
            if (movieInfo.rating === undefined ||
                typeof movieInfo.rating !== 'number') {
                res.status(400).json({ error: 'Invalid Movie Rating' });
                return;
            }
            try {
                yield movieData.getMovieById(req.params.id);
            }
            catch (e) {
                res.status(404).json({ error: 'No Movie Found' });
                return;
            }
            try {
                const updateMovie = yield movieData.updateMovie(req.params.id, movieInfo.title, movieInfo.cast, movieInfo.info, movieInfo.plot, movieInfo.rating);
                res.json(updateMovie);
            }
            catch (e) {
                res.sendStatus(400);
            }
        }));
        router.patch('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const movieInfo = req.body;
            if (!movieInfo) {
                res.status(400).json({ error: 'No Movie Data Provided' });
                return;
            }
            if (movieInfo.title && typeof movieInfo.title !== 'string') {
                res.status(400).json({ error: 'Invalid Movie Title' });
                return;
            }
            if (movieInfo.cast) {
                if (!Array.isArray(movieInfo.cast)) {
                    res.status(400).json({ error: 'Invalid Movie Cast' });
                    return;
                }
                for (let i of movieInfo.cast) {
                    if (typeof i !== 'object' ||
                        !i.firstName ||
                        !i.lastName ||
                        typeof i.firstName !== 'string' ||
                        typeof i.lastName !== 'string') {
                        res.status(400).json({
                            error: 'Invalid Movie Cast Content',
                        });
                        return;
                    }
                }
            }
            if (movieInfo.info &&
                (typeof movieInfo.info !== 'object' ||
                    typeof movieInfo.info.director !== 'string' ||
                    typeof movieInfo.info.yearReleased !== 'number' ||
                    movieInfo.info.yearReleased % 1 !== 0 ||
                    movieInfo.info.yearReleased < 0)) {
                res.status(400).json({ error: 'Invalid Movie Info' });
                return;
            }
            if (movieInfo.plot && typeof movieInfo.plot !== 'string') {
                res.status(400).json({ error: 'Invalid Movie Plot' });
                return;
            }
            if (movieInfo.rating && typeof movieInfo.rating !== 'number') {
                res.status(400).json({ error: 'Invalid Movie Rating' });
                return;
            }
            let oldData;
            try {
                oldData = yield movieData.getMovieById(req.params.id);
            }
            catch (e) {
                res.status(404).json({ error: 'No Movie Found' });
                return;
            }
            try {
                const updateMovie = yield movieData.updateMovie(req.params.id, movieInfo.title ? movieInfo.title : oldData.title, movieInfo.cast ? movieInfo.cast : oldData.cast, movieInfo.info ? movieInfo.info : oldData.info, movieInfo.plot ? movieInfo.plot : oldData.plot, movieInfo.rating ? movieInfo.rating : oldData.rating);
                res.json(updateMovie);
            }
            catch (e) {
                res.sendStatus(400);
            }
        }));
        router.post('/:id/comments', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const commentInfo = req.body;
            if (!commentInfo.name || typeof commentInfo.name !== 'string') {
                res.status(400).json({ error: 'No Comment Name Provided' });
                return;
            }
            if (!commentInfo.comment ||
                typeof commentInfo.comment !== 'string') {
                res.status(400).json({ error: 'No Comment Content Provided' });
                return;
            }
            try {
                const newComment = yield commentData.addComment(req.params.id, commentInfo.name, commentInfo.comment);
                res.json(newComment);
            }
            catch (e) {
                res.sendStatus(400);
            }
        }));
        router.delete('/:movieId/:commentId', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const output = yield commentData.deleteComment(req.params.commentId, req.params.movieId);
                res.json(output);
            }
            catch (e) {
                res.sendStatus(404);
            }
        }));
        this.app.use('/api/movies', router);
        this.app.use('*', (req, res) => {
            res.sendStatus(404);
        });
    }
}
exports.default = new App().app;
