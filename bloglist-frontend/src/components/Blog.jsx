import { useState } from 'react'

const Blog = ({ blog, user, incrementLikes, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const itemStyle = {
    padding: 2,
  }

  return (
    <div style={blogStyle}>
      {showDetails && (
        <div>
          <div>
            <span style={itemStyle}>{blog.title}</span>
            <span style={itemStyle}>{blog.author}</span>
            <button onClick={() => setShowDetails(false)}>hide</button>
          </div>
          <div>
            <a href={blog.url}>{blog.url}</a>
          </div>
          <div>
            <span style={itemStyle}>likes: {blog.likes}</span>
            <button onClick={() => incrementLikes(blog)}>like</button>
          </div>
          <div>
            {blog && blog.user && user && user.username === blog.user.username && (
              <button onClick={() => deleteBlog(blog)}>delete</button>
            )}
          </div>
          <div>{showDetails && blog.user && blog.user.username}</div>
        </div>
      )}
      {!showDetails && (
        <div>
          <div>
            <span style={itemStyle}>{blog.title}</span>
            <span style={itemStyle}>{blog.author}</span>
            <button onClick={() => setShowDetails(true)}>show</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog
