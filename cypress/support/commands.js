// Custom Cypress commands

// Login command
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  cy.visit('/login.html');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('form').submit();
  cy.url().should('include', '/dashboard.html');
});

// Create application command
Cypress.Commands.add('createApplication', (application) => {
  const defaultApp = {
    collegeName: 'Test University',
    deadline: '2024-12-31',
    status: 'in-progress',
    applicationFee: 75,
    requirements: [
      { name: 'Common App', completed: false },
      { name: 'Transcripts', completed: false }
    ],
    notes: 'Test application'
  };

  const app = { ...defaultApp, ...application };

  cy.get('.add-application-btn').click();
  cy.get('input[name="collegeName"]').type(app.collegeName);
  cy.get('input[name="deadline"]').type(app.deadline);
  cy.get('select[name="status"]').select(app.status);
  cy.get('input[name="applicationFee"]').type(app.applicationFee);

  // Add requirements
  app.requirements.forEach((req, index) => {
    if (index > 0) cy.get('.add-requirement-btn').click();
    cy.get(`input[name="requirements[${index}].name"]`).type(req.name);
    if (req.completed) {
      cy.get(`input[name="requirements[${index}].completed"]`).check();
    }
  });

  if (app.notes) {
    cy.get('textarea[name="notes"]').type(app.notes);
  }

  cy.get('form').submit();
});

// Clear database command
Cypress.Commands.add('clearDatabase', () => {
  cy.request('POST', `${Cypress.env('apiUrl')}/test/reset`);
});

// Setup test data command
Cypress.Commands.add('setupTestData', () => {
  cy.request('POST', `${Cypress.env('apiUrl')}/test/seed`);
});

// Check notification command
Cypress.Commands.add('checkNotification', (message) => {
  cy.get('.notifications')
    .should('be.visible')
    .and('contain', message);
});

// Wait for API command
Cypress.Commands.add('waitForApi', () => {
  cy.request({
    url: `${Cypress.env('apiUrl')}/health`,
    retryOnStatusCodeFailure: true,
    retryDelay: 1000,
    timeout: 30000
  }).its('status').should('eq', 200);
});

// Intercept API requests
beforeEach(() => {
  cy.intercept('GET', `${Cypress.env('apiUrl')}/applications*`).as('getApplications');
  cy.intercept('POST', `${Cypress.env('apiUrl')}/applications`).as('createApplication');
  cy.intercept('PUT', `${Cypress.env('apiUrl')}/applications/*`).as('updateApplication');
  cy.intercept('DELETE', `${Cypress.env('apiUrl')}/applications/*`).as('deleteApplication');
});

// Clear local storage between tests
beforeEach(() => {
  cy.clearLocalStorage();
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent Cypress from failing the test
  return false;
});
