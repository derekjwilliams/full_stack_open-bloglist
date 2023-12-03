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
})