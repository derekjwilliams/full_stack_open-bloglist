import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const localStorageUserKey = 'loggedBlogappUser'
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationKind, setNotificationKind] = useState('notification')

  const notficationDuration = 5000 //milliseconds

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
      setBlogs(blogs)
    })
  }, [])

  const Blogs = () => (
    <div>
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )

  const handleBlogTitleChange = (event) => {
    setNewBlogTitle(event.target.value)
  }

  const handleBlogAuthorChange = (event) => {
    setNewBlogAuthor(event.target.value)
  }

  const handleBlogUrlChange = (event) => {
    setNewBlogUrl(event.target.value)
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <label htmlFor='blog-title'>Title</label>
        <input
          value={newBlogTitle}
          name='blog-title'
          onChange={handleBlogTitleChange}
        />
      </div>
      <div>
        <label htmlFor='blog-author'>Author</label>
        <input
          value={newBlogAuthor}
          name='blog-author'
          onChange={handleBlogAuthorChange}
        />
      </div>
      <div>
        <label htmlFor='blog-url'>URL</label>
        <input
          value={newBlogUrl}
          name='blog-url'
          onChange={handleBlogUrlChange}
        />
      </div>
      <button type='submit'>create</button>
    </form>
  )

  const loginForm = () => (
    <div>
      <h1>log in to application</h1>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )

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

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
      likes: 0,
    }

    blogService.create(blogObject).then((blog) => {
      setBlogs(blogs.concat(blog))
      setNotificationKind('success')
      setNotificationMessage(
        `a new blog ${newBlogTitle} by ${newBlogAuthor} added`
      )
      setTimeout(() => {
        setNotificationKind('')
        setNotificationMessage(null)
      }, notficationDuration)
      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')
    })
  }
  return (
    <div>
      <Notification message={notificationMessage} kind={notificationKind} />
      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name}({user.username}) logged in{' '}
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
