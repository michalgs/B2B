describe('Negotiation Workflow', () => {
  const generateUser = (role) => {
    const now = Date.now() + Math.floor(Math.random() * 1000);
    // Ensure NIP is exactly 10 digits
    const nip = Array.from({length: 10}, () => Math.floor(Math.random() * 10)).join('');
    return {
      firstName: `${role}`,
      lastName: 'User',
      email: `${role}-${now}@example.com`,
      password: 'password123',
      companyName: `${role} Corp ${now}`,
      nip: nip,
      companyAddress: `${role} St`
    };
  };

  let user1;
  let user2;
  let negotiationTitle;

  beforeEach(() => {
    cy.clearCookies();
    user1 = generateUser('sender');
    user2 = generateUser('recipient');
    negotiationTitle = `Project Alpha ${Date.now()}`;
    
    cy.intercept('POST', '**/api/v1/auth/register').as('registerUser');
    cy.intercept('POST', '**/api/v1/auth/login').as('loginUser');
    cy.intercept('POST', '**/api/v1/contracts').as('createContract');
    cy.intercept('PATCH', '**/api/v1/contracts/*/status').as('updateStatus');
    cy.intercept('POST', '**/api/v1/contracts/*/counter-offer').as('counterOffer');
    cy.intercept('GET', '**/api/v1/contracts').as('getContracts');
  });

  const register = (user) => {
    cy.log(`Registering user: ${user.email} for company: ${user.companyName}`);
    cy.visit('/register');
    cy.get('[data-test="firstname-input"]').type(user.firstName);
    cy.get('[data-test="lastname-input"]').type(user.lastName);
    cy.get('[data-test="email-input"]').type(user.email);
    cy.get('[data-test="company-name-input"]').type(user.companyName);
    cy.get('[data-test="nip-input"]').type(user.nip);
    cy.get('[data-test="company-address-input"]').type(user.companyAddress);
    cy.get('[data-test="password-input"]').type(user.password);
    cy.get('[data-test="register-submit"]').click();
    cy.wait('@registerUser', { timeout: 15000 }).its('response.statusCode').should('eq', 200);
    cy.url({ timeout: 15000 }).should('include', '/login');
  };

  const login = (user) => {
    cy.log(`Logging in user: ${user.email}`);
    cy.visit('/login');
    cy.get('[data-test="email-input"]').type(user.email);
    cy.get('[data-test="password-input"]').type(user.password);
    cy.get('[data-test="login-submit"]').click();
    cy.wait('@loginUser', { timeout: 15000 }).its('response.statusCode').should('eq', 200);
    cy.url({ timeout: 15000 }).should('include', '/dashboard');
  };

  it('should complete a full negotiation flow: send, receive, and accept', () => {
    // 1. Setup
    register(user2);
    register(user1);
    login(user1);

    // 2. Send Negotiation Invitation
    cy.get('[data-test="new-negotiation-button"]').should('be.visible').click();
    cy.get('[data-test="negotiation-title-input"]').type(negotiationTitle);
    cy.get('[data-test="negotiation-price-input"]').type('10000');
    
    cy.get('[data-test="recipient-company-select"]').should('be.visible').click();
    // Using double click as requested by user
    cy.get('[role="option"]', { timeout: 10000 }).contains(user2.companyName).click({ force: true });
    cy.get('[role="option"]').contains(user2.companyName).click({ force: true });
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    cy.get('[data-test="negotiation-deadline-input"]').type(tomorrow.toISOString().slice(0, 16));
    cy.get('[data-test="negotiation-description-input"]').type('Initial description');
    cy.get('[data-test="negotiation-submit-button"]').click();
    
    cy.wait('@createContract', { timeout: 15000 }).its('response.statusCode').should('eq', 201);
    cy.get('[data-test="negotiation-modal"]', { timeout: 15000 }).should('not.exist');
    
    cy.wait('@getContracts');
    cy.get('[data-test="negotiation-item"]').should('have.length.at.least', 1);
    cy.get('[data-test="negotiation-item"]').first().within(() => {
      cy.get('[data-test="negotiation-partner"]').should('contain', user2.companyName);
      cy.get('[data-test="negotiation-status"]').should('contain', 'Invited');
    });

    // 3. Recipient Accepts
    cy.clearCookies();
    login(user2);

    // cy.pause();

    cy.get('[data-test="negotiation-item"]').first().click();
    cy.get('[data-test="accept-offer-button"]').should('be.visible').click();
    cy.wait('@updateStatus', { timeout: 15000 }).its('response.statusCode').should('eq', 200);
    
    // Status should be updated in dashboard
    cy.url().should('include', '/dashboard');
    
    cy.get('[data-test="negotiation-item"]').first().within(() => {
      cy.get('[data-test="negotiation-status"]').then($el => {
        cy.log(`Current status displayed: ${$el.text()}`);
      });
      cy.get('[data-test="negotiation-status"]').should('contain', 'Accepted');
    });
  });

  it('should allow sending a counter-offer and viewing negotiation history', () => {
    // 1. Setup
    register(user2);
    register(user1);
    login(user1);

    // 2. Sender creates negotiation
    cy.get('[data-test="new-negotiation-button"]').click();
    cy.get('[data-test="negotiation-title-input"]').type('Initial Offer');
    cy.get('[data-test="negotiation-price-input"]').type('1000');
    cy.get('[data-test="recipient-company-select"]').click();
    // Using double click as requested by user
    cy.get('[role="option"]', { timeout: 10000 }).contains(user2.companyName).click({ force: true });
    cy.get('[role="option"]').contains(user2.companyName).click({ force: true });
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    cy.get('[data-test="negotiation-deadline-input"]').type(tomorrow.toISOString().slice(0, 16));
    cy.get('[data-test="negotiation-description-input"]').type('Initial description');
    cy.get('[data-test="negotiation-submit-button"]').click();
    cy.wait('@createContract', { timeout: 15000 });
    cy.get('[data-test="negotiation-modal"]').should('not.exist');

    // 3. Recipient counters
    cy.clearCookies();
    login(user2);

    cy.get('[data-test="negotiation-item"]').first().click();
    cy.get('[data-test="view-offer-title"]').should('contain', 'Initial Offer');
    
    cy.get('[data-test="counter-offer-button"]').click();
    cy.get('[data-test="counter-title-input"]').clear().type('Counter Offer 1');
    cy.get('[data-test="counter-price-input"]').clear().type('1200');
    cy.get('[data-test="counter-description-input"]').clear().type('Counter description');
    cy.get('[data-test="counter-submit-button"]').click();
    cy.wait('@counterOffer', { timeout: 15000 }).its('response.statusCode').should('eq', 200);

    cy.get('[data-test="counter-offer-form"]').should('not.exist');
    cy.get('[data-test="view-offer-title"]').should('contain', 'Counter Offer 1');
    cy.get('[data-test="history-item"]').should('have.length', 2);

    // 4. Sender Accepts Counter
    cy.clearCookies();
    login(user1);

    cy.get('[data-test="negotiation-item"]').first().click();
    cy.get('[data-test="view-offer-title"]').should('contain', 'Counter Offer 1');
    cy.get('[data-test="accept-offer-button"]').click();
    cy.wait('@updateStatus', { timeout: 15000 }).its('response.statusCode').should('eq', 200);
    
    cy.url().should('include', '/dashboard');
    cy.wait('@getContracts');
    cy.get('[data-test="negotiation-status"]').first().should('contain', 'Accepted');
  });
});
