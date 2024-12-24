describe('Application Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/login.html');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('form').submit();
    
    // Should be on dashboard
    cy.url().should('include', '/dashboard.html');
  });

  it('should create a new application', () => {
    // Click add application button
    cy.get('.add-application-btn').click();
    
    // Fill out application form
    cy.get('input[name="collegeName"]').type('Harvard University');
    cy.get('input[name="deadline"]').type('2024-12-31');
    cy.get('select[name="status"]').select('in-progress');
    cy.get('input[name="applicationFee"]').type('75');
    
    // Add requirements
    cy.get('.add-requirement-btn').click();
    cy.get('input[name="requirements[0].name"]').type('Common App');
    cy.get('input[name="requirements[0].completed"]').check();
    
    cy.get('.add-requirement-btn').click();
    cy.get('input[name="requirements[1].name"]').type('Transcripts');
    
    // Add notes
    cy.get('textarea[name="notes"]').type('Need to complete essay');
    
    // Submit form
    cy.get('form').submit();
    
    // Verify application appears in list
    cy.get('.applications-list')
      .should('contain', 'Harvard University')
      .and('contain', 'In Progress');
  });

  it('should filter applications by status', () => {
    // Create a submitted application first
    cy.get('.add-application-btn').click();
    cy.get('input[name="collegeName"]').type('MIT');
    cy.get('input[name="deadline"]').type('2024-11-30');
    cy.get('select[name="status"]').select('submitted');
    cy.get('form').submit();
    
    // Filter by status
    cy.get('select[name="statusFilter"]').select('submitted');
    
    // Should show MIT but not Harvard
    cy.get('.applications-list')
      .should('contain', 'MIT')
      .and('not.contain', 'Harvard University');
  });

  it('should update application status', () => {
    // Find Harvard application
    cy.contains('.application-card', 'Harvard University')
      .within(() => {
        // Click edit button
        cy.get('.edit-btn').click();
        
        // Change status to submitted
        cy.get('select[name="status"]').select('submitted');
        
        // Save changes
        cy.get('.save-btn').click();
      });
    
    // Verify status changed
    cy.contains('.application-card', 'Harvard University')
      .should('contain', 'Submitted');
  });

  it('should delete application', () => {
    // Find MIT application
    cy.contains('.application-card', 'MIT')
      .within(() => {
        // Click delete button
        cy.get('.delete-btn').click();
      });
    
    // Confirm deletion
    cy.get('.confirm-delete-btn').click();
    
    // Verify application removed
    cy.get('.applications-list')
      .should('not.contain', 'MIT');
  });

  it('should show deadline notifications', () => {
    // Create application with close deadline
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const deadlineDate = tomorrow.toISOString().split('T')[0];
    
    cy.get('.add-application-btn').click();
    cy.get('input[name="collegeName"]').type('Stanford University');
    cy.get('input[name="deadline"]').type(deadlineDate);
    cy.get('select[name="status"]').select('in-progress');
    cy.get('form').submit();
    
    // Should show deadline warning
    cy.get('.notifications')
      .should('contain', 'Stanford University application due tomorrow');
  });

  it('should track application progress', () => {
    // Find Harvard application
    cy.contains('.application-card', 'Harvard University')
      .within(() => {
        // Check progress bar
        cy.get('.progress-bar')
          .should('contain', '50%'); // One of two requirements completed
        
        // Complete second requirement
        cy.get('.edit-btn').click();
        cy.get('input[name="requirements[1].completed"]').check();
        cy.get('.save-btn').click();
        
        // Verify progress updated
        cy.get('.progress-bar')
          .should('contain', '100%');
      });
  });
});
