describe('Authentication Flow', () => {
  const uniqueEmail = `test-${Date.now()}@example.com`;

  beforeEach(() => {
    // Clear cookies before each test to ensure a clean state
    cy.clearCookies();
  });

  describe('Login Page', () => {
    it('should display validation errors for empty fields', () => {
      cy.visitWithWait('/login');
      cy.get('[data-test="login-submit"]').click({ force: true });

      cy.get('[data-test="email-error"]').should('contain', 'Email is required');
      cy.get('[data-test="password-error"]').should('contain', 'Password is required');
    });

    it('should display error for invalid credentials', () => {
      cy.visitWithWait('/login');
      cy.get('[data-test="email-input"]').type('nonexistent@example.com');
      cy.get('[data-test="password-input"]').type('wrongpassword');
      cy.get('[data-test="login-submit"]').click();

      cy.get('[data-test="auth-error"]').should('be.visible')
        .and('contain', 'Invalid credentials');
    });

    it('should navigate to registration page', () => {
      cy.visitWithWait('/login');
      cy.get('[data-test="register-link"]').click();
      cy.url().should('include', '/register');
    });
  });

  describe('Registration Page', () => {
    it('should display validation errors for empty fields', () => {
      cy.visitWithWait('/register');
      cy.get('[data-test="register-submit"]').click();

      cy.get('[data-test="firstname-error"]').should('contain', 'First name is required');
      cy.get('[data-test="lastname-error"]').should('contain', 'Last name is required');
      cy.get('[data-test="email-error"]').should('contain', 'Email is required');
      cy.get('[data-test="password-error"]').should('contain', 'Password is required');
    });

    it('should successfully register a new user and redirect to login', () => {
      cy.visitWithWait('/register');
      cy.get('[data-test="firstname-input"]').type('John');
      cy.get('[data-test="lastname-input"]').type('Doe');
      cy.get('[data-test="email-input"]').type(uniqueEmail);
      cy.get('[data-test="password-input"]').type('password123');
      cy.get('[data-test="register-submit"]').click();

      // Should redirect to login
      cy.url().should('include', '/login');
    });

    it('should display error if email is already in use', () => {
      // First, register the user (using the same email from previous test)
      // This assumes the previous test ran successfully and the user exists
      cy.visitWithWait('/register');
      cy.get('[data-test="firstname-input"]').type('John');
      cy.get('[data-test="lastname-input"]').type('Doe');
      cy.get('[data-test="email-input"]').type(uniqueEmail);
      cy.get('[data-test="password-input"]').type('password123');
      cy.get('[data-test="register-submit"]').click();

      // Try to register again with same email
      cy.visitWithWait('/register');
      cy.get('[data-test="firstname-input"]').type('Jane');
      cy.get('[data-test="lastname-input"]').type('Smith');
      cy.get('[data-test="email-input"]').type(uniqueEmail);
      cy.get('[data-test="password-input"]').type('password123');
      cy.get('[data-test="register-submit"]').click();

      cy.get('[data-test="register-error"]').should('be.visible')
        .and('contain', 'An error occurred');
    });
  });

  describe('Full Flow', () => {
    it('should register, login, and access dashboard', () => {
      const flowEmail = `flow-${Date.now()}@example.com`;

      // 1. Register
      cy.visitWithWait('/register');
      cy.get('[data-test="firstname-input"]').type('Flow');
      cy.get('[data-test="lastname-input"]').type('User');
      cy.get('[data-test="email-input"]').type(flowEmail);
      cy.get('[data-test="password-input"]').type('password123');
      cy.get('[data-test="register-submit"]').click();

      // 2. Login
      cy.url().should('include', '/login');
      cy.get('[data-test="email-input"]').type(flowEmail);
      cy.get('[data-test="password-input"]').type('password123');
      cy.get('[data-test="login-submit"]').click();

      // 3. Dashboard
      cy.url().should('include', '/dashboard');
      cy.contains('Welcome, Flow User!').should('be.visible');
      cy.contains(flowEmail).should('be.visible');
    });
  });
});
