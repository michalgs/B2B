describe('Negotiation Workflow', () => {
  const now = Date.now();
  
  // User 1 (Sender)
  const user1 = {
    firstName: 'Sender',
    lastName: 'User',
    email: `sender-${now}@example.com`,
    password: 'password123',
    companyName: `Sender Corp ${now}`,
    nip: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
    companyAddress: '123 Sender St'
  };

  // User 2 (Recipient)
  const user2 = {
    firstName: 'Recipient',
    lastName: 'User',
    email: `recipient-${now}@example.com`,
    password: 'password123',
    companyName: `Recipient Corp ${now}`,
    nip: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
    companyAddress: '456 Recipient St'
  };

  const negotiationTitle = `Project Alpha ${now}`;

  beforeEach(() => {
    cy.clearCookies();
  });

  it('should complete a full negotiation flow: send, receive, and accept', () => {
    // 1. Register Recipient first (so they are available in the dropdown for Sender)
    cy.visit('/register');
    cy.get('[data-test="firstname-input"]').type(user2.firstName);
    cy.get('[data-test="lastname-input"]').type(user2.lastName);
    cy.get('[data-test="email-input"]').type(user2.email);
    cy.get('[data-test="company-name-input"]').type(user2.companyName);
    cy.get('[data-test="nip-input"]').type(user2.nip);
    cy.get('[data-test="company-address-input"]').type(user2.companyAddress);
    cy.get('[data-test="password-input"]').type(user2.password);
    cy.get('[data-test="register-submit"]').click();
    cy.url().should('include', '/login');

    // 2. Register Sender
    cy.visit('/register');
    cy.get('[data-test="firstname-input"]').type(user1.firstName);
    cy.get('[data-test="lastname-input"]').type(user1.lastName);
    cy.get('[data-test="email-input"]').type(user1.email);
    cy.get('[data-test="company-name-input"]').type(user1.companyName);
    cy.get('[data-test="nip-input"]').type(user1.nip);
    cy.get('[data-test="company-address-input"]').type(user1.companyAddress);
    cy.get('[data-test="password-input"]').type(user1.password);
    cy.get('[data-test="register-submit"]').click();
    cy.url().should('include', '/login');

    // 3. Login as Sender
    cy.get('[data-test="email-input"]').type(user1.email);
    cy.get('[data-test="password-input"]').type(user1.password);
    cy.get('[data-test="login-submit"]').click();
    cy.url().should('include', '/dashboard');

    // 4. Send Negotiation Invitation
    cy.get('[data-test="new-negotiation-button"]').should('be.visible').click();

    cy.get('[data-test="negotiation-title-input"]').type(negotiationTitle);
    cy.get('[data-test="negotiation-price-input"]').type('10000');
    
    // Fill the modal
    cy.get('[data-test="recipient-company-select"]').should('be.visible').click();
    cy.pause();
    // Select the recipient from the dropdown - using global role as it might be in a portal
    // For some reason, it has to be clicked twice
    cy.get('[role="option"]').contains(user2.companyName).click({ force: true });
    cy.get('[role="option"]').contains(user2.companyName).click({ force: true });
    
    
    // Set a deadline (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const deadlineStr = tomorrow.toISOString().slice(0, 16); // format: YYYY-MM-DDTHH:mm
    cy.get('[data-test="negotiation-deadline-input"]').type(deadlineStr);
    
    cy.get('[data-test="negotiation-description-input"]').type('We would like to offer our services for this project.');
    
    // Intercept the creation call to verify it happens
    cy.intercept('POST', '**/api/v1/contracts').as('createContract');

    cy.get('[data-test="negotiation-submit-button"]').scrollIntoView().should('be.visible').click();
    
    // Wait for the API call to complete
    cy.wait('@createContract').its('response.statusCode').should('eq', 201);

    // Wait for modal to disappear
    cy.get('[data-test="negotiation-modal"]', { timeout: 10000 }).should('not.exist');
    
    // Verify it appears in Sender's dashboard
    cy.get('[data-test="negotiation-item"]').should('have.length.at.least', 1);
    cy.get('[data-test="negotiation-item"]').first().within(() => {
      cy.get('[data-test="negotiation-partner"]').should('contain', user2.companyName);
      cy.get('[data-test="negotiation-status"]').should('contain', 'Invited');
    });

    // 5. Logout and Login as Recipient
    cy.clearCookies(); // Force logout/session clear
    cy.visit('/login');
    cy.get('[data-test="email-input"]').type(user2.email);
    cy.get('[data-test="password-input"]').type(user2.password);
    cy.get('[data-test="login-submit"]').click();
    cy.url().should('include', '/dashboard');

    // 6. Verify and Accept the Negotiation
    cy.get('[data-test="negotiation-item"]').should('have.length.at.least', 1);
    cy.get('[data-test="negotiation-item"]').first().within(() => {
      cy.get('[data-test="negotiation-partner"]').should('contain', user1.companyName);
      cy.get('[data-test="negotiation-status"]').should('contain', 'Invited');
    }).click();
    
    // Accept the offer
    cy.get('[data-test="accept-offer-button"]').should('be.visible').click();
    
    // Wait for modal to disappear
    cy.get('[data-test="negotiation-details-modal"]', { timeout: 10000 }).should('not.exist');
    
    // Status should change to In Progress
    cy.get('[data-test="negotiation-item"]').first().within(() => {
      cy.get('[data-test="negotiation-status"]').should('contain', 'In Progress');
    });

    // 7. Logout and Login as Sender to verify status change
    cy.clearCookies();
    cy.visit('/login');
    cy.get('[data-test="email-input"]').type(user1.email);
    cy.get('[data-test="password-input"]').type(user1.password);
    cy.get('[data-test="login-submit"]').click();
    cy.url().should('include', '/dashboard');
    
    // Verify status is updated for Sender
    cy.get('[data-test="negotiation-item"]').should('have.length.at.least', 1);
    cy.get('[data-test="negotiation-item"]').first().within(() => {
      cy.get('[data-test="negotiation-partner"]').should('contain', user2.companyName);
      cy.get('[data-test="negotiation-status"]').should('contain', 'In Progress');
    });
  });
});
