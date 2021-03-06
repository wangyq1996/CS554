import React, { useEffect, useState } from 'react';
import classes from './ShowDetail.module.css';
import { Redirect } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import getData from './getData';

const ShowDetail = (props) => {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const port = props.match.params.port;
    const id = props.match.params.id;
    let data;

    useEffect(() => {
        console.log('loading data useeffect');
        const fetchData = async () => {
            try {
                const data = (await getData(port, 'id', id)).results;
                if (data.length === 0) throw 'No Such Id';
                setDetail(data[0]);
                setLoading(false);
            } catch (e) {
                setError(true);
            }
        };
        fetchData();
    }, [id]);

    if (error) {
        return <Redirect to="/error" status={404} />;
    }

    const buildCard = () => {
        return (
            <Card style={{ width: '80%', margin: '0 auto', height: '80vh' }}>
                <Card.Img
                    variant="top"
                    src={`${detail.thumbnail.path}/portrait_medium.jpg`}
                    style={{
                        width: '200px',
                        height: '300px',
                        margin: '10px auto',
                    }}
                    alt="Movie Image"
                />
                <Card.Title style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {port === 'characters' ? detail.name : detail.title}
                </Card.Title>
                <Card.Body style={{ height: '60vh', overflow: 'scroll' }}>
                    <Card.Text>Type: {detail.type}</Card.Text>
                    <Card.Text>Rating: {detail.rating}</Card.Text>
                    <Card.Text>Start Year: {detail.startYear}</Card.Text>
                    <Card.Text>End Year: {detail.endYear}</Card.Text>
                    <Card.Text>Description: {detail.description}</Card.Text>
                </Card.Body>
                <Card.Body>
                    <Card.Link
                        onClick={() => {
                            window.history.back();
                        }}
                    >
                        Go Back
                    </Card.Link>
                    <Card.Link
                        href={detail.urls[0].url}
                        style={{ float: 'right' }}
                    >
                        See More Details
                    </Card.Link>
                </Card.Body>
            </Card>
        );
    };

    if (loading) {
        return (
            <div className={classes.loading}>
                <h2>Loading...</h2>
            </div>
        );
    }

    if (detail) data = buildCard();

    return <div>{data}</div>;
};

export default ShowDetail;
