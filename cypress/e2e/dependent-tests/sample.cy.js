describe('Dependent tests bad practice', () => {
  beforeEach(() => {
    cy.visit('https://notes-serverless-app.com/login')

    cy.get('#email').type(Cypress.env('user_email'))
    cy.get('#password').type(Cypress.env('user_password'), { log: false })
    cy.get('button[type="submit"]').click()
    
    cy.contains('h1', 'Your Notes', {timeout: 10000}).should('be.visible')
  })

  it('CRUDs a note', () => {
    cy.contains('Create a new note').click()

    cy.get('#content').type('My note')
    cy.contains('Create').click()

    cy.get('.list-group')
      .as('listNotes')
      .should('contain', 'My note')
      .click()

    cy.get('#content').type(' updated')
    cy.contains('Save').click()

    cy.get('@listNotes').should('contain', 'My note updated')
    cy.get('@listNotes').contains('My note updated', {timeout: 10000}).should('be.visible').click()

    cy.contains('Delete').click()

    cy.get('.list-group a')
      .its('length')
      .should('be.at.least', 1)

    cy.get('@listNotes').contains('My note updated', {timeout: 10000}).should('not.exist')
  })
})
