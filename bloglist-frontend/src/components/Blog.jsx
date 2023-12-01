import { useState } from 'react'

const Blog = ({ blog, user, incrementLikes, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false)
  const blogStyle = {
    padding: '1rem 0',
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const itemStyle = {
    padding: '0.5rem',
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      {showDetails && (
        <div>
          <div>
            <span style={itemStyle} className='blog-title'>
              {blog.title}
            </span>
            <span style={itemStyle} className='blog-author'>
              {blog.author}
            </span>
            <button onClick={() => setShowDetails(false)}>hide</button>
          </div>
          <div style={itemStyle} className='blog-url'>
            <a href={blog.url}>{blog.url}</a>
          </div>
          <div>
            <label style={itemStyle} htmlFor='blog-likes'>
              likes:
            </label>
            <span style={itemStyle} className='blog-likes' name='blog-likes'>
              {blog.likes}
            </span>
            <button onClick={() => incrementLikes(blog)}>like</button>
          </div>
          <div style={itemStyle}>
            {blog &&
              blog.user &&
              user &&
              user.username === blog.user.username && (
                <button onClick={() => deleteBlog(blog)}>delete</button>
              )}
          </div>
          <div style={itemStyle} className='blog-username'>
            {showDetails && blog.user && blog.user.username}
          </div>
        </div>
      )}
      {!showDetails && (
        <div>
          <div>
            <span style={itemStyle} className='blog-title'>
              {blog.title}
            </span>
            <span style={itemStyle} className='blog-author'>
              {blog.author}
            </span>
            <button
              data-testid='blog-show-details'
              onClick={() => setShowDetails(true)}
            >
              show
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog
