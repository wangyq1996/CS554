import React from 'react';
import Homepage from './components/Homepage';
import ShowList from './components/ShowList';
import ShowDetail from './components/ShowDetail';
import NotFound from './components/NotFound';
import Footer from './components/component/Footer';
import classes from './App.module.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/component/Navbar';

const App = () => {
    return (
        <Router>
            <div className={classes.body}>
                <Navbar />
                <div className={classes.container}>
                    <Switch>
                        <Route exact path="/" component={Homepage} />
                        <Route
                            exact
                            path="/:port/page/:pagenum"
                            component={ShowList}
                        />
                        <Route exact path="/:port/:id" component={ShowDetail} />
                        <Route path="/" component={NotFound} stats={404} />
                    </Switch>
                </div>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
