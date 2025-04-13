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
        // Load active loans
        const activeLoansResponse = await fetch('/api/borrower/active-loans', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const activeLoans = await activeLoansResponse.json();
        displayActiveLoans(activeLoans);

        // Load loan history
        const historyResponse = await fetch('/api/borrower/loan-history', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const history = await historyResponse.json();
        displayLoanHistory(history);

        // Load payment schedule
        const scheduleResponse = await fetch('/api/borrower/payment-schedule', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const schedule = await scheduleResponse.json();
        displayPaymentSchedule(schedule);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Display active loans
function displayActiveLoans(loans) {
    const container = document.getElementById('activeLoans');
    if (loans.length === 0) {
        container.innerHTML = '<p>No active loans</p>';
        return;
    }

    const loansList = loans.map(loan => `
        <div class="loan-item">
            <h4>Loan #${loan.id}</h4>
            <p>Amount: $${loan.amount}</p>
            <p>Interest Rate: ${loan.interestRate}%</p>
            <p>Term: ${loan.term} months</p>
            <p>Status: ${loan.status}</p>
        </div>
    `).join('');

    container.innerHTML = loansList;
}

// Display loan history
function displayLoanHistory(history) {
    const container = document.getElementById('loanHistory');
    if (history.length === 0) {
        container.innerHTML = '<p>No loan history</p>';
        return;
    }

    const historyList = history.map(loan => `
        <div class="loan-item">
            <h4>Loan #${loan.id}</h4>
            <p>Amount: $${loan.amount}</p>
            <p>Status: ${loan.status}</p>
            <p>Completed: ${new Date(loan.completedDate).toLocaleDateString()}</p>
        </div>
    `).join('');

    container.innerHTML = historyList;
}

// Display payment schedule
function displayPaymentSchedule(schedule) {
    const container = document.getElementById('paymentSchedule');
    if (schedule.length === 0) {
        container.innerHTML = '<p>No payment schedule</p>';
        return;
    }

    const scheduleList = schedule.map(payment => `
        <div class="payment-item">
            <p>Due Date: ${new Date(payment.dueDate).toLocaleDateString()}</p>
            <p>Amount: $${payment.amount}</p>
            <p>Status: ${payment.status}</p>
        </div>
    `).join('');

    container.innerHTML = scheduleList;
}

// Show loan application form
function showLoanApplicationForm() {
    const modal = document.getElementById('loanApplicationModal');
    modal.style.display = 'block';
}

// Close modal
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function() {
        this.closest('.modal').style.display = 'none';
    }
});

// Handle loan application submission
document.getElementById('loanApplicationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        amount: document.getElementById('loanAmount').value,
        purpose: document.getElementById('loanPurpose').value,
        term: document.getElementById('loanTerm').value,
        description: document.getElementById('description').value
    };

    try {
        const response = await fetch('/api/borrower/apply-loan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Loan application submitted successfully!');
            document.getElementById('loanApplicationModal').style.display = 'none';
            loadDashboardData(); // Refresh dashboard data
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to submit loan application');
        }
    } catch (error) {
        console.error('Error submitting loan application:', error);
        alert('Failed to submit loan application');
    }
});

// Logout function
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
} 