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
    })

    it('Blog creation can be canceled', function() {
      cy.get('.toggle-on').click()
      cy.get('.toggle-off').click()
      cy.get('input[name="blog-title"]').should('not.be.visible')
      cy.get('input[name="blog-author"]').should('not.be.visible')
      cy.get('input[name="blog-url"]').should('not.be.visible')
    })
  })

})