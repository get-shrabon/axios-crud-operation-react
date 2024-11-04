
import { useEffect, useRef, useState } from 'react';
import { deletePost, getPosts } from './api/PostApi';
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
  console.log(selectedPost);


  return (
    <section className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-10'>
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
            <form onSubmit={(e) => e.preventDefault()}>
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
            </form>
          )}

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">Close</Button>
            </DialogClose>

            {modalType === 'edit' ?
              <Button
                type="submit"
                variant="outline"
                className="ml-3"
              >
                Save
              </Button>
              :
              <Button
                type="submit"
                variant="destructive"
                className="ml-3"
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
