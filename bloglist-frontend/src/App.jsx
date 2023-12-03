import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Toggleable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const localStorageUserKey = 'loggedBlogappUser'
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationKind, setNotificationKind] = useState('notification')

  const notficationDuration = 5000 //milliseconds
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(localStorageUserKey)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    })
  }, [])

  const incrementLikes = (blog) => {
    blog.likes = blog.likes + 1
    const returnedBlog = blogService.update(blog) //todo update state
    const updatedBlogs = blogs
      .map((blog) => {
        if (blog.id === returnedBlog.id) {
          return returnedBlog
        }
        return blog
      })
      .sort((a, b) => b.likes - a.likes)
    setBlogs(updatedBlogs)
  }

  const deleteBlog = (blogToDelete) => {
    if (window.confirm(`Remove blog: ${blogToDelete.title}?`)) {
      blogService.remove(blogToDelete)
      const updatedBlogs = blogs
        .filter((blog) => {
          return blog.id !== blogToDelete.id
        })
        .sort((a, b) => b.likes - a.likes)
      setBlogs(updatedBlogs)
    }
  }

  const Blogs = () => (
    <div>
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          incrementLikes={incrementLikes}
          deleteBlog={deleteBlog}
        />
      ))}
    </div>
  )

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog))
      setNotificationKind('success')
      setNotificationMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      )
      setTimeout(() => {
        setNotificationKind('')
        setNotificationMessage(null)
      }, notficationDuration)
    })
  }

  function handleLogout() {
    blogService.setToken(null)
    setUser(null)
    window.localStorage.removeItem(localStorageUserKey)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(localStorageUserKey, JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotificationKind('success')
      setNotificationMessage(`${username} logged in`)
      setTimeout(() => {
        setNotificationKind('')
        setNotificationMessage(null)
      }, notficationDuration)
    } catch (exception) {
      setNotificationKind('error')
      setNotificationMessage('Wrong username or password')
      setTimeout(() => {
        setNotificationKind('')
        setNotificationMessage(null)
      }, notficationDuration)
    }
  }
  const blogForm = () => (
    <Togglable buttonLabel='add blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )
  return (
    <div>
      <Notification message={notificationMessage} kind={notificationKind} />
      {!user && (
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      )}
      {user && (
        <div>
          <p>
            {user.name} logged in{' '}
            <button onClick={handleLogout}>logout</button>
          </p>
          {blogForm()}
          {Blogs()}
        </div>
      )}
    </div>
  )
}

export default App
