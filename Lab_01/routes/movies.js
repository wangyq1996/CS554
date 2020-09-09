const express = require('express');
const router = express.Router();
const data = require('../data');
const movieData = data.movies;
const commentData = data.comments;

router.get('/', async (req, res) => {
    const skip = Number.parseInt(req.query.skip);
    const take = Number.parseInt(req.query.take);
    if (
        (skip && Number.isNaN(skip)) ||
        skip <= 0 ||
        (take && Number.isNaN(take))
    ) {
        res.status(400).json({ error: 'Invalid Query Input' });
        return;
    }
    try {
        const movieList = await movieData.getAllMovies(
            req.query.skip,
            req.query.take
        );
        res.json(movieList);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const movie = await movieData.getMovieById(req.params.id);
        res.json(movie);
    } catch (e) {
        res.status(404).json({ error: 'Movie Not Found' });
    }
});

router.post('/', async (req, res) => {
    const movieInfo = req.body;

    if (!movieInfo) {
        res.status(400).json({ error: 'No Movie Data Provided' });
        return;
    }

    if (!movieInfo.title) {
        res.status(400).json({ error: 'No Movie Title Provided' });
        return;
    }

    if (!movieInfo.cast) {
        res.status(400).json({ error: 'No Movie Cast Provided' });
        return;
    }

    if (!movieInfo.info) {
        res.status(400).json({ error: 'No Movie Info Provided' });
        return;
    }

    if (!movieInfo.plot) {
        res.status(400).json({ error: 'No Movie Plot Provided' });
        return;
    }

    if (!movieInfo.rating) {
        res.status(400).json({ error: 'No Movie Rating Provided' });
        return;
    }

    try {
        const newMovie = await movieData.addMovie(
            movieInfo.title,
            movieInfo.cast,
            movieInfo.info,
            movieInfo.plot,
            movieInfo.rating
        );
        res.json(newMovie);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.put('/:id', async (req, res) => {
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
        if (typeof i !== 'object') {
            res.status(400).json({ error: 'Invalid Movie Cast Content' });
            return;
        }
    }

    if (
        !movieInfo.info ||
        typeof movieInfo.info !== 'object' ||
        typeof movieInfo.info.director !== 'string' ||
        typeof movieInfo.info.yearReleased !== 'number' ||
        movieInfo.info.yearReleased % 1 !== 0 ||
        movieInfo.info.yearReleased < 0
    ) {
        res.status(400).json({ error: 'Invalid Movie Info' });
        return;
    }

    if (!movieInfo.plot || typeof movieInfo.plot !== 'string') {
        res.status(400).json({ error: 'Invalid Movie Plot' });
        return;
    }

    if (!movieInfo.rating || typeof movieInfo.rating !== 'number') {
        res.status(400).json({ error: 'Invalid Movie Rating' });
        return;
    }

    try {
        await movieData.getMovieById(req.params.id);
    } catch (e) {
        res.status(404).json({ error: 'No Movie Found' });
        return;
    }

    try {
        const updateMovie = await movieData.updateMovie(
            req.params.id,
            movieInfo.title,
            movieInfo.cast,
            movieInfo.info,
            movieInfo.plot,
            movieInfo.rating
        );
        res.json(updateMovie);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.patch('/:id', async (req, res) => {
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
            if (typeof i !== 'object') {
                res.status(400).json({ error: 'Invalid Movie Cast Content' });
                return;
            }
        }
    }

    if (
        movieInfo.info &&
        (typeof movieInfo.info !== 'object' ||
            typeof movieInfo.info.director !== 'string' ||
            typeof movieInfo.info.yearReleased !== 'number' ||
            movieInfo.info.yearReleased % 1 !== 0 ||
            movieInfo.info.yearReleased < 0)
    ) {
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

    try {
        await movieData.getMovieById(req.params.id);
    } catch (e) {
        res.status(404).json({ error: 'No Movie Found' });
        return;
    }

    try {
        const updateMovie = await movieData.updateMovie(
            req.params.id,
            movieInfo.title,
            movieInfo.cast,
            movieInfo.info,
            movieInfo.plot,
            movieInfo.rating
        );
        res.json(updateMovie);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.post('/:id/comments', async (req, res) => {
    const commentInfo = req.body;

    if (!commentInfo.name) {
        res.status(400).json({ error: 'No Comment Name Provided' });
        return;
    }

    if (!commentInfo.comment) {
        res.status(400).json({ error: 'No Comment Content Provided' });
        return;
    }

    try {
        const newComment = await commentData.addComment(
            req.params.id,
            commentInfo.name,
            commentInfo.comment
        );
        res.json(newComment);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.delete('/:movieId/:commentId', async (req, res) => {
    console.log(req.params);
    try {
        await commentData.deleteComment(
            req.params.commentId,
            req.params.movieId
        );
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(500);
    }
});

module.exports = router;
