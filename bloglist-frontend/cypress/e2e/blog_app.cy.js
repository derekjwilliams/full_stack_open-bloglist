describe('Bloglist app', function() {
  // after beforeEach there will be zero blogs and one user, John
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'John Lennon',
      username: 'John',
      password: 'abbeyroad'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    const user2 = {
      name: 'Ringo Starr',
      username: 'Ringo',
      password: 'yellowsubmarine'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user2)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.visit('http://localhost:5173')
    cy.contains('Login')
  })
  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('John')
      cy.get('#password').type('abbeyroad')
      cy.get('#login-button').click()

      cy.contains('John Lennon logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('John')
      cy.get('#password').type('badpassword')
      cy.get('#login-button').click()

      cy.contains('Wrong username or password')
    })

    it('fails with wrong credentials, showing correct error color in notification', function() {
      cy.get('#username').type('John')
      cy.get('#password').type('badpassword')
      cy.get('#login-button').click()
      cy.get('.notification')
        .should('have.css','color','rgb(255, 0, 0)')
    })
  })
  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('John')
      cy.get('#password').type('abbeyroad')
      cy.get('#login-button').click()
    })

    it('Blog inputs are displayed', function() {
      cy.get('.toggle-on').click()
      cy.get('input[name="blog-title"]').should('exist')
      cy.get('input[name="blog-author"]').should('exist')
      cy.get('input[name="blog-url"]').should('exist')
    })

    it('blog can be created', function() {
      cy.get('.toggle-on').click()
      cy.get('input[name="blog-title"]').type('test blog title')
      cy.get('input[name="blog-author"]').type('test blog author')
      cy.get('input[name="blog-url"]').type('https://fullstackopen.com/en/')
      cy.get('[data-testid="blogform-create-blog"]').click()
      cy.contains('test blog title')
      cy.contains('test blog author')
      cy.contains('test blog author')
      cy.get('.blog-item [data-testid="blog-show-details"]').should('exist')
    })

    it('Blog creation can be canceled', function() {
      cy.get('.toggle-on').click()
      cy.get('.toggle-off').click()
      cy.get('input[name="blog-title"]').should('not.be.visible')
      cy.get('input[name="blog-author"]').should('not.be.visible')
      cy.get('input[name="blog-url"]').should('not.be.visible')
    })

    it('Blog can be liked', function() {
      cy.get('.toggle-on').click()
      cy.get('input[name="blog-title"]').type('test blog title')
      cy.get('input[name="blog-author"]').type('test blog author')
      cy.get('input[name="blog-url"]').type('https://fullstackopen.com/en/')
      cy.get('[data-testid="blogform-create-blog"]').click()

      cy.get('.blog-item [data-testid="blog-show-details"]').click()
      cy.get('[data-testid="increment-blog-like"]').click()
      cy.get('span.blog-likes').contains('1')
      cy.get('[data-testid="increment-blog-like"]').click()
      cy.get('span.blog-likes').contains('2')
    })

    it('Blog can be deleted', function() {
      cy.get('.toggle-on').click()
      cy.get('input[name="blog-title"]').type('test blog title')
      cy.get('input[name="blog-author"]').type('test blog author')
      cy.get('input[name="blog-url"]').type('https://fullstackopen.com/en/')
      cy.get('[data-testid="blogform-create-blog"]').click()

      cy.get('.blog-item [data-testid="blog-show-details"]').click()
      cy.get('[data-testid="delete-blog"]').click()
      cy.get('.blog-item').should('not.exist')
    })

    it('Blog cannot be deleted by a different user', function() {
      cy.get('.toggle-on').click()
      cy.get('input[name="blog-title"]').type('test blog title')
      cy.get('input[name="blog-author"]').type('test blog author')
      cy.get('input[name="blog-url"]').type('https://fullstackopen.com/en/')
      cy.get('[data-testid="blogform-create-blog"]').click()

      cy.get('[data-testid="logout-button"]').click()
      cy.get('#username').type('Ringo')
      cy.get('#password').type('yellowsubmarine')
      cy.get('#login-button').click()

      cy.get('.blog-item [data-testid="blog-show-details"]').click()
      cy.get('[data-testid="delete-blog"]').should('not.exist')
    })

    it('Blogs are sorted by likes', function() {
      // add a blog
      cy.get('.toggle-on').click()
      cy.get('input[name="blog-title"]').type('test blog title')
      cy.get('input[name="blog-author"]').type('test blog author')
      cy.get('input[name="blog-url"]').type('https://fullstackopen.com/en/')
      cy.get('[data-testid="blogform-create-blog"]').click()

      // add a second blog
      cy.get('.toggle-on').click()
      cy.get('input[name="blog-title"]').type('test blog title 2')
      cy.get('input[name="blog-author"]').type('test blog author 2')
      cy.get('input[name="blog-url"]').type('https://fullstackopen.com')
      cy.get('[data-testid="blogform-create-blog"]').click()

      cy.get('.blog-item:nth-of-type(1) [data-testid="blog-show-details"]').click()// show 1st blog
      cy.get('.blog-item:nth-of-type(1) [data-testid="increment-blog-like"]').click() // click the like button
      cy.get('.blog-item:nth-of-type(2) [data-testid="blog-show-details"]').click()// show 2nd blog
      cy.get('.blog-item:nth-of-type(2) [data-testid="increment-blog-like"]').click() // click the like button on 2nd blog
      cy.get('.blog-item:nth-of-type(2) [data-testid="increment-blog-like"]').click() // click the like button 2nd blog, this will change the order

      // verify that the title of the first item is the second blog entry, 'test blog title 2'
      cy.get('.blog-item:nth-of-type(1)').contains('test blog title 2')
    })

  })
})