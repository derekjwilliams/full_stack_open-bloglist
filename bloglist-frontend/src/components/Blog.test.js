import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section',
    likes: 1,
    user: {
      username: 'John',
      name: 'John Lennon',
      id: '6563446d01a8f4f64788555e',
    },
    id: '6568889d8c0b6f89f4750588',
  }
  const user = {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG4iLCJpZCI6IjY1NjM0NDZkMDFhOGY0ZjY0Nzg4NTU1ZSIsImlhdCI6MTcwMTM1MzA0MCwiZXhwIjoxNzAxMzU2NjQwfQ.TdGey-jOgfKmGgE4vKIim4xwjuzqXkbPXnLfEYE5yZw",
    username: "John",
    name: "John Lennon"
  }
  
  const { container } = render(<Blog blog={blog} user={user}/>)

  const titleElement = container.querySelector('.blog-title')
  expect(titleElement).toBeDefined()

  const authorElement = container.querySelector('.blog-author')
  expect(authorElement).toBeDefined()

  const urlElement = container.querySelector('.blog-url')
  expect(urlElement).toBeNull()

})
