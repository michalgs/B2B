Cypress.Commands.add('visitWithWait', (url, options) => {
  cy.visit(url, options);
  cy.wait(5000);
});
