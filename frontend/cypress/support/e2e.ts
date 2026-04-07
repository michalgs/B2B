// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
//

Cypress.on("uncaught:exception", (err) => {
  // Cypress and React Hydrating the document don't get along
  // for some unknown reason.
  // https://github.com/remix-run/remix/issues/4822#issuecomment-1679195650
  // https://github.com/cypress-io/cypress/issues/27204
  if (
    /hydrat/i.test(err.message) ||
    /Minified React error #418/.test(err.message) ||
    /Minified React error #423/.test(err.message)
  ) {
    return false
  }
})
