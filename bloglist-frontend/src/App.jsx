import { useState, useEffect } from 'react'
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
            {user.name}({user.username}) logged in{' '}
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel='add blog'>
            <BlogForm
              onSubmit={addBlog}
              title={newBlogTitle}
              author={newBlogAuthor}
              url={newBlogUrl}
              handleTitleChange={({ target }) => setNewBlogTitle(target.value)}
              handleAuthorChange={({ target }) =>
                setNewBlogAuthor(target.value)
              }
              handleUrlChange={({ target }) => setNewBlogUrl(target.value)}
            />
          </Togglable>
          {Blogs()}
        </div>
      )}
    </div>
  )
}

export default App
