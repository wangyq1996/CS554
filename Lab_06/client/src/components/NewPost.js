import React from 'react';
import queries from '../queries';
import { useMutation } from '@apollo/client';

const NewPost = () => {
    const [uploadPost] = useMutation(queries.ADD_IMAGE);

    let url;
    let posterName;
    let description;
    return (
        <div>
            <form
                onSubmit={() => {
                    uploadPost({
                        variables: {
                            url: url.value,
                            posterName: posterName.value,
                            description: description.value,
                        },
                    });
                    url = '';
                    posterName = '';
                    description = '';
                    alert('Post Added');
                }}
            >
                <label>
                    URL:
                    <br />
                    <input ref={(node) => url=node} required autoFocus/>
                </label>
                <br />
                <label>
                    PosterName:
                    <br />
                    <input ref={(node) => posterName=node}/>
                </label>
                <br />
                <label>
                    Description:
                    <br />
                    <input ref={(node) => description=node}/>
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default NewPost;
