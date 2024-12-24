describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear local storage before each test
    cy.clearLocalStorage();
  });

  it('should register a new user', () => {
    cy.visit('/signup.html');
    
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    
    cy.get('form').submit();
    
    // Should redirect to dashboard after successful registration
    cy.url().should('include', '/dashboard.html');
    cy.get('.user-name').should('contain', 'Test User');
  });

  it('should not register with existing email', () => {
    cy.visit('/signup.html');
    
    cy.get('input[name="name"]').type('Another User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    
    cy.get('form').submit();
    
    // Should show error message
    cy.get('.error-message').should('be.visible')
      .and('contain', 'Email already exists');
  });

  it('should login with correct credentials', () => {
    cy.visit('/login.html');
    
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    
    cy.get('form').submit();
    
    // Should redirect to dashboard
    cy.url().should('include', '/dashboard.html');
    cy.get('.user-name').should('contain', 'Test User');
  });

  it('should not login with incorrect password', () => {
    cy.visit('/login.html');
    
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    
    cy.get('form').submit();
    
    // Should show error message
    cy.get('.error-message').should('be.visible')
      .and('contain', 'Invalid credentials');
  });

  it('should logout successfully', () => {
    // Login first
    cy.visit('/login.html');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('form').submit();
    
    // Click logout button
    cy.get('.logout-button').click();
    
    // Should redirect to login page
    cy.url().should('include', '/login.html');
    
    // Try accessing dashboard (should redirect to login)
    cy.visit('/dashboard.html');
    cy.url().should('include', '/login.html');
  });
});
