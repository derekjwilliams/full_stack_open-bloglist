import React from 'react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

import { render, screen, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('Blog Form component', () => {
  test.only('clicking the create blog button calls event handler', async () => {
    const mockCreateBlogHandler = jest.fn()

    render(<BlogForm createBlog={mockCreateBlogHandler} />)
    const user = userEvent.setup()
    const button = await screen.findByTestId('blogform-create-blog')
    await user.click(button)

    expect(mockCreateBlogHandler.mock.calls).toHaveLength(1)
  })
})
