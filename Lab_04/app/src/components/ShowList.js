import React, { useEffect, useState } from 'react';
import classes from './ShowList.module.css';
import { ListGroup, Pagination } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import Header from './component/Header';
import getData from './getData';

const ShowList = (props) => {
    const [showsData, setShowsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastPage, setLastPage] = useState(0);
    const [error, setError] = useState(false);
    const pageNum = props.match.params.pagenum;
    const port = props.match.params.port;
    let item;

    useEffect(() => {
        console.log('loading data useeffect');
        const pNum = parseInt(pageNum);
        if (isNaN(pNum)) setError(true);
        const fetchData = async () => {
            if (!error) {
                try {
                    const data = await getData(port, 'page', pageNum);
                    if (data === 'No Data Found' || data === 'Error')
                        throw 'error';
                    let last = parseInt(data.total / 20);
                    if (last * 20 === data.total) last--;
                    setLastPage(last);
                    setShowsData(data);
                    setLoading(false);
                } catch (e) {
                    setError(true);
                }
            }
        };
        fetchData();
    }, []);

    if (error) {
        return <Redirect to="/error" status={404} />;
    }

    const buildList = (data) => {
        return (
            <ListGroup.Item action href={`/${port}/${data.id}`} key={data.id}>
                {port === 'characters' ? data.name : data.title}
            </ListGroup.Item>
        );
    };

    const paginationRender = () => {
        const output = [];
        if (showsData) {
            const pNum = parseInt(pageNum);
            const left = Math.max(pNum - 2, 0);
            const right = Math.min(left + 4, lastPage);
            if (left !== 0) {
                output.push(
                    <Pagination.Item
                        href="./0"
                        key={0}
                        aria-label={`Go to first page`}
                    >
                        {0}
                    </Pagination.Item>
                );
                if (left > 1)
                    output.push(
                        <Pagination.Ellipsis
                            key={1}
                            aria-label={`Ellipsis left`}
                        />
                    );
            }
            for (let i = left; i <= right; i++)
                output.push(
                    <Pagination.Item
                        key={i}
                        active={i === pNum}
                        href={`./${i}`}
                        aria-label={`Go to Page${i}`}
                    >
                        {i}
                    </Pagination.Item>
                );
            if (right !== lastPage) {
                if (right < lastPage - 1)
                    output.push(
                        <Pagination.Ellipsis
                            key={lastPage - 1}
                            aria-label={`Ellipsis right`}
                        />
                    );
                output.push(
                    <Pagination.Item
                        href={`./${lastPage}`}
                        key={lastPage}
                        aria-label={`Go to Last Page`}
                    >
                        {lastPage}
                    </Pagination.Item>
                );
            }
        }
        return output;
    };

    item =
        showsData &&
        showsData.results.map((data) => {
            return buildList(data);
        });

    const pRedner = paginationRender();

    if (loading) {
        return (
            <div className={classes.loading}>
                <h2>Loading...</h2>
            </div>
        );
    } else {
        return (
            <div className={classes.list}>
                <Header title={port} />
                <div className={classes.listgroup}>
                    <ListGroup variant="flush">{item}</ListGroup>
                </div>
                <Pagination className={classes.pagination}>
                    <Pagination.First
                        disabled={parseInt(pageNum) === 0 ? true : false}
                        href="./0"
                    />
                    <Pagination.Prev
                        disabled={parseInt(pageNum) === 0 ? true : false}
                        href={`./${parseInt(pageNum) - 1}`}
                    />
                    {pRedner}
                    <Pagination.Next
                        disabled={parseInt(pageNum) === lastPage ? true : false}
                        href={`./${parseInt(pageNum) + 1}`}
                    />
                    <Pagination.Last
                        disabled={parseInt(pageNum) === lastPage ? true : false}
                        href={`./${lastPage}`}
                    />
                </Pagination>
            </div>
        );
    }
};

export default ShowList;
