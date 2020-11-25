import * as express from 'express';
import { Request, Response } from 'express';
const data = require('./data');
const movieData = data.movies;
const commentData = data.comments;

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    private config(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));

        let reqCount = 0;

        this.app.use(function (req: Request, res: Response, next) {
            reqCount++;
            console.log('Number of Requests:' + reqCount);
            next();
        });

        this.app.use(
            function (req: Request, res: Response, next) {
                console.log('Request Body:', req.body);
                next();
            },
            function (req: Request, res: Response, next) {
                console.log('Request URL:', req.originalUrl);
                next();
            },
            function (req: Request, res: Response, next) {
                console.log('Request Type:', req.method);
                next();
            }
        );

        let json = {};

        this.app.use(function (req: Request, res: Response, next) {
            if (!json[req.originalUrl]) json[req.originalUrl] = 0;
            json[req.originalUrl]++;
            console.log(
                req.originalUrl +
                    ' has been requested ' +
                    json[req.originalUrl] +
                    ' times.'
            );
            next();
        });
    }

    private routes(): void {
        const router = express.Router();

        router.get('/', async (req: Request, res: Response) => {
            const skip: number = Number.parseInt(
                req.query.skip ? req.query.skip.toString() : '0'
            );
            const take: number = Number.parseInt(
                req.query.take ? req.query.take.toString() : '20'
            );
            if (Number.isNaN(skip) || skip < 0 || Number.isNaN(take)) {
                res.status(400).json({ error: 'Invalid Query Input' });
                return;
            }
            try {
                const movieList = await movieData.getAllMovies(skip, take);
                res.json(movieList);
            } catch (e) {
                res.sendStatus(400);
            }
        });

        router.get('/:id', async (req: Request, res: Response) => {
            try {
                const movie = await movieData.getMovieById(req.params.id);
                res.json(movie);
            } catch (e) {
                res.status(404).json({ error: 'Movie Not Found' });
            }
        });

        router.post('/', async (req: Request, res: Response) => {
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
                if (
                    typeof i !== 'object' ||
                    !i.firstName ||
                    !i.lastName ||
                    typeof i.firstName !== 'string' ||
                    typeof i.lastName !== 'string'
                ) {
                    res.status(400).json({
                        error: 'Invalid Movie Cast Content',
                    });
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

            if (
                movieInfo.rating === undefined ||
                typeof movieInfo.rating !== 'number'
            ) {
                res.status(400).json({ error: 'Invalid Movie Rating' });
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
                res.sendStatus(400);
            }
        });

        router.put('/:id', async (req: Request, res: Response) => {
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
                if (
                    typeof i !== 'object' ||
                    !i.firstName ||
                    !i.lastName ||
                    typeof i.firstName !== 'string' ||
                    typeof i.lastName !== 'string'
                ) {
                    res.status(400).json({
                        error: 'Invalid Movie Cast Content',
                    });
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

            if (
                movieInfo.rating === undefined ||
                typeof movieInfo.rating !== 'number'
            ) {
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
                res.sendStatus(400);
            }
        });

        router.patch('/:id', async (req: Request, res: Response) => {
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
                    if (
                        typeof i !== 'object' ||
                        !i.firstName ||
                        !i.lastName ||
                        typeof i.firstName !== 'string' ||
                        typeof i.lastName !== 'string'
                    ) {
                        res.status(400).json({
                            error: 'Invalid Movie Cast Content',
                        });
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

            let oldData;

            try {
                oldData = await movieData.getMovieById(req.params.id);
            } catch (e) {
                res.status(404).json({ error: 'No Movie Found' });
                return;
            }

            try {
                const updateMovie = await movieData.updateMovie(
                    req.params.id,
                    movieInfo.title ? movieInfo.title : oldData.title,
                    movieInfo.cast ? movieInfo.cast : oldData.cast,
                    movieInfo.info ? movieInfo.info : oldData.info,
                    movieInfo.plot ? movieInfo.plot : oldData.plot,
                    movieInfo.rating ? movieInfo.rating : oldData.rating
                );
                res.json(updateMovie);
            } catch (e) {
                res.sendStatus(400);
            }
        });

        router.post('/:id/comments', async (req: Request, res: Response) => {
            const commentInfo = req.body;

            if (!commentInfo.name || typeof commentInfo.name !== 'string') {
                res.status(400).json({ error: 'No Comment Name Provided' });
                return;
            }

            if (
                !commentInfo.comment ||
                typeof commentInfo.comment !== 'string'
            ) {
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
                res.sendStatus(400);
            }
        });

        router.delete(
            '/:movieId/:commentId',
            async (req: Request, res: Response) => {
                try {
                    const output: any = await commentData.deleteComment(
                        req.params.commentId,
                        req.params.movieId
                    );
                    res.json(output);
                } catch (e) {
                    res.sendStatus(404);
                }
            }
        );

        this.app.use('/api/movies', router);
        this.app.use('*', (req: Request, res: Response) => {
            res.sendStatus(404);
        });
    }
}

export default new App().app;
