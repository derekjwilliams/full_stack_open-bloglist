const BlogForm = ({
  onSubmit,
  title,
  author,
  url,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
}) => (
  <div>
    <h2>create new</h2>
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor='blog-title'>Title</label>
        <input value={title} name='blog-title' onChange={handleTitleChange} />
      </div>
      <div>
        <label htmlFor='blog-author'>Author</label>
        <input
          value={author}
          name='blog-author'
          onChange={handleAuthorChange}
        />
      </div>
      <div>
        <label htmlFor='blog-url'>URL</label>
        <input value={url} name='blog-url' onChange={handleUrlChange} />
      </div>
      <button type='submit'>create</button>
    </form>
  </div>
)

export default BlogForm
