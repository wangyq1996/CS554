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
const comments = mongoCollections.comments;
const movieCollection = mongoCollections.movies;
const movies = require('./movies');
const ObjID = require('mongodb').ObjectID;
const addComment = (id, name, comment) => __awaiter(void 0, void 0, void 0, function* () {
    const oldMovie = yield movies.getMovieById(id);
    if (!oldMovie)
        throw 'No such movie';
    const commentCollection = yield comments();
    const newComment = {
        name: name,
        comment: comment,
    };
    const newCommentInformation = yield commentCollection.insertOne(newComment);
    if (newCommentInformation.insertedCount === 0)
        throw 'Insert Failed';
    const newID = newCommentInformation.insertedId;
    const insertedComment = {
        id: newID,
        name: newComment.name,
        comment: newComment.comment,
    };
    oldMovie.comments.push(insertedComment);
    const movieCollections = yield movieCollection();
    yield movieCollections.updateOne({ _id: ObjID(id) }, { $set: oldMovie });
    return yield movieCollections.findOne({ _id: ObjID(id) });
});
const getCommentById = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const commentCollection = yield comments();
    const comment = yield commentCollection.findOne({ _id: ObjID(commentId) });
    if (!comment)
        throw 'No Comment Found';
    return comment;
});
const deleteComment = (commentId, movieId) => __awaiter(void 0, void 0, void 0, function* () {
    yield getCommentById(commentId);
    const oldMovie = yield movies.getMovieById(movieId);
    for (let i = 0; i < oldMovie.comments.length; i++) {
        if (oldMovie.comments[i].id.toString() === commentId) {
            oldMovie.comments.splice(i, 1);
            break;
        }
    }
    const movieCollections = yield movieCollection();
    yield movieCollections.updateOne({ _id: ObjID(movieId) }, { $set: oldMovie });
    const commentCollection = yield comments();
    const deletionInfo = yield commentCollection.removeOne({
        _id: ObjID(commentId),
    });
    if (deletionInfo.deletedCount === 0)
        throw 'No user deleted';
    return yield movieCollections.findOne({ _id: ObjID(movieId) });
});
module.exports = {
    addComment,
    deleteComment,
};
