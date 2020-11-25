import { ObjectId } from 'mongodb';

const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const movieCollection = mongoCollections.movies;
const movies = require('./movies');
const ObjID = require('mongodb').ObjectID;

const addComment = async (
    id: string,
    name: string,
    comment: string
): Promise<object> => {
    const oldMovie = await movies.getMovieById(id);
    if (!oldMovie) throw 'No such movie';

    const commentCollection = await comments();

    interface newComment {
        name: string;
        comment: string;
    }

    const newComment: newComment = {
        name: name,
        comment: comment,
    };

    const newCommentInformation = await commentCollection.insertOne(newComment);
    if (newCommentInformation.insertedCount === 0) throw 'Insert Failed';
    const newID: ObjectId = newCommentInformation.insertedId;

    interface insertedComment {
        id: ObjectId;
        name: string;
        comment: string;
    }

    const insertedComment: insertedComment = {
        id: newID,
        name: newComment.name,
        comment: newComment.comment,
    };

    oldMovie.comments.push(insertedComment);

    const movieCollections = await movieCollection();

    await movieCollections.updateOne({ _id: ObjID(id) }, { $set: oldMovie });

    return await movieCollections.findOne({ _id: ObjID(id) });
};

const getCommentById = async (commentId: string): Promise<object> => {
    const commentCollection = await comments();

    const comment = await commentCollection.findOne({ _id: ObjID(commentId) });
    if (!comment) throw 'No Comment Found';

    return comment;
};

const deleteComment = async (
    commentId: string,
    movieId: string
): Promise<Boolean> => {
    await getCommentById(commentId);
    const oldMovie = await movies.getMovieById(movieId);

    for (let i: number = 0; i < oldMovie.comments.length; i++) {
        if (oldMovie.comments[i].id.toString() === commentId) {
            oldMovie.comments.splice(i, 1);
            break;
        }
    }

    const movieCollections = await movieCollection();

    await movieCollections.updateOne(
        { _id: ObjID(movieId) },
        { $set: oldMovie }
    );

    const commentCollection = await comments();

    const deletionInfo = await commentCollection.removeOne({
        _id: ObjID(commentId),
    });
    if (deletionInfo.deletedCount === 0) throw 'No user deleted';
    return await movieCollections.findOne({ _id: ObjID(movieId) });
};

module.exports = {
    addComment,
    deleteComment,
};
