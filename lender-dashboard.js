// Check authentication
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Load user data
    loadUserData();
    loadDashboardData();
});

// Load user data
async function loadUserData() {
    try {
        const response = await fetch('/api/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        document.getElementById('userName').textContent = data.name;
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load loan applications
        const applicationsResponse = await fetch('/api/lender/loan-requests', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const applications = await applicationsResponse.json();
        displayLoanApplications(applications);

        // Load active loans
        const activeLoansResponse = await fetch('/api/lender/active-loans', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const activeLoans = await activeLoansResponse.json();
        displayActiveLoans(activeLoans);

        // Load loan performance
        const performanceResponse = await fetch('/api/lender/loan-performance', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const performance = await performanceResponse.json();
        displayLoanPerformance(performance);

        // Load risk assessment
        const riskResponse = await fetch('/api/lender/risk-assessment', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const risk = await riskResponse.json();
        displayRiskAssessment(risk);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Display loan applications
function displayLoanApplications(applications) {
    const container = document.getElementById('loanApplications');
    const pendingLoans = applications.filter(app => app.status === 'pending');
    
    if (pendingLoans.length === 0) {
        container.innerHTML = '<p>No pending loan applications</p>';
        return;
    }

    const applicationsList = pendingLoans.map(application => `
        <div class="application-item">
            <h4>${application.borrowerName}</h4>
            <p><strong>Location:</strong> ${application.location}</p>
            <p><strong>Amount:</strong> ₹${application.amount}</p>
            <p><strong>Purpose:</strong> ${application.purpose}</p>
            <p><strong>Farm Size:</strong> ${application.farmSize}</p>
            <p><strong>Crop Type:</strong> ${application.cropType}</p>
            <p><strong>Expected Harvest:</strong> ${application.expectedHarvest}</p>
            <p><strong>Interest Rate:</strong> <span class="interest-rate">${application.interestRate}%</span></p>
            <p><strong>Risk Score:</strong> <span class="risk-score">${application.riskScore}/100</span></p>
            <div class="action-buttons">
                <button onclick="reviewApplication('${application.id}')" class="secondary-btn">Review</button>
                <button onclick="approveApplication('${application.id}')" class="success-btn">Approve</button>
                <button onclick="rejectApplication('${application.id}')" class="danger-btn">Reject</button>
            </div>
        </div>
    `).join('');

    container.innerHTML = applicationsList;
}

// Display active loans
function displayActiveLoans(loans) {
    const container = document.getElementById('activeLoans');
    const activeLoans = loans.filter(loan => loan.status === 'active');
    
    if (activeLoans.length === 0) {
        container.innerHTML = '<p>No active loans</p>';
        return;
    }

    const loansList = activeLoans.map(loan => `
        <div class="loan-item">
            <h4>${loan.borrowerName}</h4>
            <p><strong>Location:</strong> ${loan.location}</p>
            <p><strong>Amount:</strong> ₹${loan.amount}</p>
            <p><strong>Purpose:</strong> ${loan.purpose}</p>
            <p><strong>Farm Size:</strong> ${loan.farmSize}</p>
            <p><strong>Crop Type:</strong> ${loan.cropType}</p>
            <p><strong>Approved On:</strong> ${new Date(loan.approvedAt).toLocaleDateString()}</p>
            <p><strong>Interest Rate:</strong> <span class="interest-rate">${loan.interestRate}%</span></p>
            <p><strong>Risk Score:</strong> <span class="risk-score">${loan.riskScore}/100</span></p>
        </div>
    `).join('');

    container.innerHTML = loansList;
}

// Display loan performance
function displayLoanPerformance(performance) {
    const container = document.getElementById('loanPerformance');
    container.innerHTML = `
        <div class="performance-stats">
            <div class="stat-item">
                <h4>Total Loans</h4>
                <p>${performance.totalLoans}</p>
            </div>
            <div class="stat-item">
                <h4>Active Loans</h4>
                <p>${performance.activeLoans}</p>
            </div>
            <div class="stat-item">
                <h4>Pending Loans</h4>
                <p>${performance.pendingLoans}</p>
            </div>
            <div class="stat-item">
                <h4>Default Rate</h4>
                <p>${(performance.defaultRate * 100).toFixed(1)}%</p>
            </div>
            <div class="stat-item">
                <h4>Average Interest Rate</h4>
                <p>${performance.averageInterestRate.toFixed(1)}%</p>
            </div>
            <div class="stat-item">
                <h4>Total Amount Lent</h4>
                <p>₹${performance.totalAmountLent.toLocaleString()}</p>
            </div>
        </div>
    `;
}

// Display risk assessment
function displayRiskAssessment(risk) {
    const container = document.getElementById('riskAssessment');
    container.innerHTML = `
        <div class="risk-stats">
            <div class="stat-item">
                <h4>Overall Risk Score</h4>
                <p>${risk.overallScore}/100</p>
            </div>
            <div class="stat-item">
                <h4>High Risk Loans</h4>
                <p>${risk.highRiskLoans}</p>
            </div>
            <div class="stat-item">
                <h4>Medium Risk Loans</h4>
                <p>${risk.mediumRiskLoans}</p>
            </div>
            <div class="stat-item">
                <h4>Low Risk Loans</h4>
                <p>${risk.lowRiskLoans}</p>
            </div>
        </div>
    `;
}

// Show loan offer modal
function showLoanOfferModal() {
    const modal = document.getElementById('loanOfferModal');
    modal.style.display = 'block';
}

// Close modal
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function() {
        this.closest('.modal').style.display = 'none';
    }
});

// Handle loan offer submission
document.getElementById('loanOfferForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        maxAmount: document.getElementById('maxLoanAmount').value,
        interestRate: document.getElementById('interestRate').value,
        term: document.getElementById('loanTerm').value,
        requirements: document.getElementById('requirements').value,
        riskLevel: document.getElementById('riskLevel').value
    };

    try {
        const response = await fetch('/api/lender/create-offer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Loan offer created successfully!');
            document.getElementById('loanOfferModal').style.display = 'none';
            loadDashboardData(); // Refresh dashboard data
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to create loan offer');
        }
    } catch (error) {
        console.error('Error creating loan offer:', error);
        alert('Failed to create loan offer');
    }
});

// Review application
async function reviewApplication(applicationId) {
    try {
        const response = await fetch(`/api/lender/review-application/${applicationId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const application = await response.json();
        // Show application details in a modal
        showApplicationDetails(application);
    } catch (error) {
        console.error('Error reviewing application:', error);
        alert('Failed to review application');
    }
}

// Approve application
async function approveApplication(applicationId) {
    if (!confirm('Are you sure you want to approve this loan application?')) {
        return;
    }

    try {
        const response = await fetch(`/api/lender/approve-loan/${applicationId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            alert('Loan approved successfully!');
            loadDashboardData(); // Refresh dashboard data
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to approve loan');
        }
    } catch (error) {
        console.error('Error approving loan:', error);
        alert('Failed to approve loan');
    }
}

// Reject application
async function rejectApplication(applicationId) {
    if (!confirm('Are you sure you want to reject this loan application?')) {
        return;
    }

    try {
        const response = await fetch(`/api/lender/reject-loan/${applicationId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            alert('Loan rejected successfully!');
            loadDashboardData(); // Refresh dashboard data
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to reject loan');
        }
    } catch (error) {
        console.error('Error rejecting loan:', error);
        alert('Failed to reject loan');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
} 