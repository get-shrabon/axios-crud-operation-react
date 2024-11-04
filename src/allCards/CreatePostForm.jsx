import { Button } from '../../components/ui/button';
import React, { useState } from 'react';
import { createPost } from '../api/PostApi';

const CreatePostForm = ({ posts, setPosts }) => {
    const [newPost, setNewPost] = useState({
        title: '',
        body: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const addPostData = async () => {
        const res = await createPost(newPost);
        console.log(res, "res");

        if (res.status === 201) {
            setPosts([...posts, res.data]);
            setNewPost({ title: '', body: '' });
            alert("Post created successfully");
        }
    }
    const handleFormSubmit = (e) => {
        e.preventDefault();
        addPostData();
    };

    return (
        <>
            <form onSubmit={handleFormSubmit} 
            className='flex items-center gap-5 w-[700px]
         bg-slate-300 px-3 py-2 rounded-lg'>
                <input
                    className='w-full p-2 rounded-lg text-white'
                    type="text"
                    placeholder='Post Title'
                    value={newPost.title}
                    onChange={handleInputChange}
                    name='title'
                    required
                />
                <input
                    className='w-full p-2 rounded-lg text-white'
                    type="text"
                    placeholder='Post Body'
                    value={newPost.body}
                    onChange={handleInputChange}
                    name='body'
                    required
                />
                <Button className='bg-blue-500'>Create</Button>
            </form>
        </>
    );
};

export default CreatePostForm;
