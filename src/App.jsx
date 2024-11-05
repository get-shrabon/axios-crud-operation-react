
import { useEffect, useRef, useState } from 'react';
import { deletePost, getPosts, updatePost } from './api/PostApi';
import './App.css'
import PostCard from './allCards/PostCard';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "../components/ui/dialog"
import { ReloadIcon } from '@radix-ui/react-icons';
import CreatePostForm from './allCards/CreatePostForm';


function App() {
  const [posts, setPosts] = useState([])
  const [showAll, setShowAll] = useState(10)
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [modalType, setModalType] = useState('')
  const [selectedPost, setSelectedPost] = useState(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [reloadIcon, setReloadIcon] = useState(null)

  const getAllPosts = async () => {
    const res = await getPosts();
    setPosts(res.data)
  }
  useEffect(() => {
    getAllPosts()
  }, [])


  // Delete Method Action
  const handleDeleteAction = async (id) => {
    try {
      setReloadIcon(true); // Show the reload icon
      const res = await deletePost(id);
      if (res.status === 200) {
        setTimeout(() => {
          const newPosts = posts.filter((post) => post.id !== id);
          setPosts(newPosts);
          setReloadIcon(false);
        }, 2000);
      } else {
        console.log(res);
        setReloadIcon(false);
      }
    } catch (error) {
      console.log(error);
      setReloadIcon(false);
    }
    // Modal close
    setIsOpenDialog(false);
  };


  const handleEdit = (post) => {
    setSelectedPost(post)
    setModalType('edit')
    setIsOpenDialog(true)
    setTitle(post.title)
    setBody(post.body)
  }
  const handleDelete = (post) => {
    setSelectedPost(post)
    setModalType('delete')
    setIsOpenDialog(true)
  }

  const closeModal = () => {
    setIsOpenDialog(false)
    setSelectedPost(null)
    setBody('')
    setTitle('')
  }


  // Edit Method Action

  const updatePostData = async () => {
    const res = await updatePost(selectedPost.id, { title, body });
    if (res.status === 200) {
      const newPosts = posts.map((post) => {
        if (post.id === selectedPost.id) {
          return res.data
        }
        return post
      })
      setPosts(newPosts)
      closeModal()
    }
  }
  const handlePostUpdate = (e) => {
    e.preventDefault();
    updatePostData();
    setIsOpenDialog(false)
  }


  return (
    <section className='container mx-auto py-10'>
      <div className='flex flex-col md:flex-row justify-between items-center mb-10'>
        <h1 className='text-3xl font-bold'>Posts: {posts.length}</h1>
        <CreatePostForm posts={posts} setPosts={setPosts} />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        {posts.slice(0, showAll).map((post) => (
          <PostCard key={post.id} post={post}
            onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
      <div className='flex justify-center mt-10'>
        {
          0 < posts.length ?

            <Button onClick={() => setShowAll(showAll + 10)}>Load More</Button>
            :
            <p className='text-center'>No more posts</p>
        }
      </div>
      <Dialog open={isOpenDialog} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modalType === 'edit' ? 'Edit Post' : 'Delete Post'}
            </DialogTitle>
            <DialogDescription>
              {modalType === 'edit'
                ? 'Modify the fields below and save changes.'
                : 'Are you sure you want to delete this post?'}
            </DialogDescription>
          </DialogHeader>

          {modalType === 'edit' && (
            <form onSubmit={handlePostUpdate}>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4">
                  <label htmlFor="title" className="text-right">Title:</label>
                  <input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    name="title"
                    placeholder="Title"
                    className="w-full rounded-md border px-3 py-1"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label htmlFor="body" className="text-right">Body:</label>
                  <textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    name="body"
                    rows={5}
                    placeholder="Body"
                    className="w-full rounded-md border px-3 py-1"
                  />
                </div>
              </div>
                <Button
                  type="submit"
                  variant="outline"
                  className="bg-blue-700 w-fit"
                >
                  Save
                </Button>
            </form>
          )}

          <DialogFooter className="sm:justify-start">


            {modalType === 'delete' &&
              <Button
                type="submit"
                variant="destructive"
                className=""
                onClick={() => handleDeleteAction(selectedPost.id)}
              >
                {reloadIcon && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                Delete
              </Button>
            }
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </section>
  )
}

export default App
