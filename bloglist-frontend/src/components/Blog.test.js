import React from 'react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

import { render, screen, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('Blog component', () => {
  let container
  let blog
  let user
  beforeEach(() => {
    blog = {
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
    user = {
      token: 'xxx',
      username: 'John',
      name: 'John Lennon',
    }
    // container = render(<Blog blog={blog} user={user} />).container
  })

  test('renders content, showing title and author by default, but not url or likes', () => {
    container = render(<Blog blog={blog} user={user} />).container
    const titleElement = container.querySelector('.blog-title')
    expect(titleElement).toBeDefined()
    expect(titleElement).not.toEqual(null)

    const authorElement = container.querySelector('.blog-author')
    expect(authorElement).toBeDefined()
    expect(authorElement).not.toEqual(null)

    const urlElement = container.querySelector('.blog-url')
    expect(urlElement).toEqual(null)

    const likesElement = container.querySelector('.blog-likes')
    expect(likesElement).toEqual(null)
  })

  test('click details button to show url and likes', async () => {
    container = render(<Blog blog={blog} user={user} />).container
    let urlElement = container.querySelector('.blog-url')
    expect(urlElement).toEqual(null)

    let likesElement = container.querySelector('.blog-likes')
    expect(likesElement).toEqual(null)

    fireEvent.click(await screen.findByTestId('blog-show-details'))
    likesElement = container.querySelector('.blog-likes')
    urlElement = container.querySelector('.blog-url')

    expect(urlElement).not.toEqual(null)
    expect(urlElement).toBeDefined()

    expect(likesElement).not.toEqual(null)
    expect(likesElement).toBeDefined()
  })

  test('clicking the like button twice calls event handler twice', async () => {
    const incrementLikesHandler = jest.fn()
  
    container = render(<Blog blog={blog} user={user} incrementLikes={incrementLikesHandler}/>).container
  
    const user = userEvent.setup()
    fireEvent.click(await screen.findByTestId('blog-show-details'))
    
    const button = await screen.getByTestId('increment-blog-like')
    await user.click(button)
    await user.click(button)
  
    expect(incrementLikesHandler.mock.calls).toHaveLength(2)
  })
})
