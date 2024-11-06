import axios from "axios";

const  api = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com"
})

// GET Method
export const getPosts = () => {
    return api.get("/posts")
}

// Delete Method
export const deletePost = (id) => {
    return api.delete(`/posts/${id}`)
}

// PUT Method
export const updatePost = (id, data) => {
    return api.put(`/posts/${id}`, data)
}

// POST Method
export const createPost = (data) => {
    return api.post("/posts", data)
}

