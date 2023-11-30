import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('Blog component', () => {
  let container

  beforeEach(() => {
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
      token: 'xxx',
      username: 'John',
      name: 'John Lennon',
    }
    container = render(<Blog blog={blog} user={user} />).container
  })
  test('renders content, showing title and author by default, but not url or likes', () => {

    const titleElement = container.querySelector('.blog-title')
    expect(titleElement).toBeDefined()

    const authorElement = container.querySelector('.blog-author')
    expect(authorElement).toBeDefined()

    const urlElement = container.querySelector('.blog-url')
    expect(urlElement).toBeNull()

    const likesElement = container.querySelector('.blog-likes')
    expect(likesElement).toBeNull()
  })
})
