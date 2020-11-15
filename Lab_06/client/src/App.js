import React from 'react';
import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    ApolloProvider,
} from '@apollo/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Main from './components/Main';
import NewPost from './components/NewPost';
import ErrorPage from './components/ErrorPage';
import './App.css';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: 'http://localhost:4000/',
    }),
});

const App = () => {
    return (
        <ApolloProvider client={client}>
            <Router>
                <header>
                    <a href="/">Home</a>
                    <a href="/my-bin">My Bin</a>
                    <a href="/my-posts">My Posts</a>
                </header>
                <Switch>
                    <Route exact path="/" component={Main}></Route>
                    <Route exact path="/my-bin" component={Main}></Route>
                    <Route exact path="/my-posts" component={Main}></Route>
                    <Route exact path="/new-post" component={NewPost}></Route>
                    <Route path="*" component={ErrorPage}></Route>
                </Switch>
            </Router>
        </ApolloProvider>
    );
};

export default App;
