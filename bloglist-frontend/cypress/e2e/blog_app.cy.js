describe('Bloglist app', function() {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.visit('http://localhost:5173')
  })

  it('home page can be opened', function() {
    cy.visit('http://localhost:5173')
    cy.contains('Login')
  })
})