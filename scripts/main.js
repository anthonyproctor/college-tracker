// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;

    if (currentPage.includes('dashboard.html') && !isLoggedIn) {
        window.location.href = 'login.html';
    } else if (currentPage.includes('login.html') && isLoggedIn) {
        window.location.href = 'dashboard.html';
    }
}

// Handle login form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Simple validation
        if (email && password) {
            // In a real app, this would be an API call
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            window.location.href = 'dashboard.html';
        }
    });
}

// Handle logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    });
}

// Modal handling
const modal = document.getElementById('addApplicationModal');
const addApplicationBtn = document.getElementById('addApplicationBtn');
const closeBtn = document.querySelector('.close');

if (addApplicationBtn) {
    addApplicationBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Handle new application form submission
const newApplicationForm = document.getElementById('newApplicationForm');
if (newApplicationForm) {
    newApplicationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const collegeName = document.getElementById('collegeName').value;
        const deadline = document.getElementById('deadline').value;
        const status = document.getElementById('status').value;
        const applicationFee = document.getElementById('applicationFee').value;
        const notes = document.getElementById('notes').value;
        
        // Get selected requirements
        const requirements = Array.from(document.querySelectorAll('input[name="requirements"]:checked'))
            .map(checkbox => checkbox.value);

        // Create new application object
        const newApplication = {
            id: Date.now(),
            collegeName,
            deadline,
            status,
            requirements,
            applicationFee,
            notes,
            dateAdded: new Date().toISOString()
        };

        // Save to localStorage
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        applications.push(newApplication);
        localStorage.setItem('applications', JSON.stringify(applications));

        // Create and append new card
        const applicationsGrid = document.querySelector('.applications-grid');
        if (applicationsGrid) {
            const card = createApplicationCard(newApplication);
            applicationsGrid.appendChild(card);
        }

        // Reset form and close modal
        newApplicationForm.reset();
        modal.style.display = 'none';
    });
}

// Function to create application card
function createApplicationCard(application) {
    const card = document.createElement('div');
    card.className = 'application-card';
    
    const statusColor = {
        'not-started': '#c0392b',
        'in-progress': '#e67e22',
        'submitted': '#27ae60'
    };

    const statusText = {
        'not-started': 'Not Started',
        'in-progress': 'In Progress',
        'submitted': 'Submitted'
    };

    card.innerHTML = `
        <h3>${application.collegeName}</h3>
        <p><strong>Status:</strong> <span style="color: ${statusColor[application.status]}">${statusText[application.status]}</span></p>
        <p><strong>Deadline:</strong> ${new Date(application.deadline).toLocaleDateString()}</p>
        <p><strong>Requirements:</strong></p>
        <ul style="list-style: none; padding: 0;">
            ${application.requirements.map(req => `
                <li style="margin: 5px 0;">
                    <input type="checkbox"> ${req.charAt(0).toUpperCase() + req.slice(1)}
                </li>
            `).join('')}
        </ul>
        ${application.applicationFee ? `<p><strong>Application Fee:</strong> $${application.applicationFee}</p>` : ''}
        ${application.notes ? `<p><strong>Notes:</strong> ${application.notes}</p>` : ''}
    `;

    return card;
}

// Load existing applications on page load
function loadApplications() {
    const applicationsGrid = document.querySelector('.applications-grid');
    if (applicationsGrid) {
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        applications.forEach(application => {
            const card = createApplicationCard(application);
            applicationsGrid.appendChild(card);
        });
    }
}

// Initialize applications on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadApplications();
});

// Initialize checkboxes in application cards
const checkboxes = document.querySelectorAll('.application-card input[type="checkbox"]');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        // In a real app, this would update the database
        const requirement = this.parentElement.textContent.trim();
        const college = this.closest('.application-card').querySelector('h3').textContent;
        console.log(`Updated ${requirement} for ${college}: ${this.checked ? 'Completed' : 'Incomplete'}`);
    });
});

// Run auth check when page loads
document.addEventListener('DOMContentLoaded', checkAuth);
