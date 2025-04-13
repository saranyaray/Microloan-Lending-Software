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
        // Load portfolio overview
        const portfolioResponse = await fetch('/api/investor/portfolio', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const portfolio = await portfolioResponse.json();
        displayPortfolioOverview(portfolio);

        // Load active investments
        const investmentsResponse = await fetch('/api/investor/active-investments', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const investments = await investmentsResponse.json();
        displayActiveInvestments(investments);

        // Load investment history
        const historyResponse = await fetch('/api/investor/investment-history', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const history = await historyResponse.json();
        displayInvestmentHistory(history);

        // Load available opportunities
        const opportunitiesResponse = await fetch('/api/investor/opportunities', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const opportunities = await opportunitiesResponse.json();
        displayInvestmentOpportunities(opportunities);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Display portfolio overview
function displayPortfolioOverview(portfolio) {
    const container = document.getElementById('portfolioOverview');
    container.innerHTML = `
        <div class="portfolio-stats">
            <div class="stat-item">
                <h4>Total Investment</h4>
                <p>$${portfolio.totalInvestment}</p>
            </div>
            <div class="stat-item">
                <h4>Current Value</h4>
                <p>$${portfolio.currentValue}</p>
            </div>
            <div class="stat-item">
                <h4>Total Returns</h4>
                <p>$${portfolio.totalReturns}</p>
            </div>
            <div class="stat-item">
                <h4>ROI</h4>
                <p>${portfolio.roi}%</p>
            </div>
        </div>
    `;
}

// Display active investments
function displayActiveInvestments(investments) {
    const container = document.getElementById('activeInvestments');
    if (investments.length === 0) {
        container.innerHTML = '<p>No active investments</p>';
        return;
    }

    const investmentsList = investments.map(investment => `
        <div class="investment-item">
            <h4>Investment #${investment.id}</h4>
            <p>Amount: $${investment.amount}</p>
            <p>Type: ${investment.type}</p>
            <p>Expected Return: $${investment.expectedReturn}</p>
            <p>Status: ${investment.status}</p>
        </div>
    `).join('');

    container.innerHTML = investmentsList;
}

// Display investment history
function displayInvestmentHistory(history) {
    const container = document.getElementById('investmentHistory');
    if (history.length === 0) {
        container.innerHTML = '<p>No investment history</p>';
        return;
    }

    const historyList = history.map(investment => `
        <div class="investment-item">
            <h4>Investment #${investment.id}</h4>
            <p>Amount: $${investment.amount}</p>
            <p>Return: $${investment.return}</p>
            <p>Status: ${investment.status}</p>
            <p>Completed: ${new Date(investment.completedDate).toLocaleDateString()}</p>
        </div>
    `).join('');

    container.innerHTML = historyList;
}

// Display investment opportunities
function displayInvestmentOpportunities(opportunities) {
    const container = document.getElementById('investmentOpportunities');
    if (opportunities.length === 0) {
        container.innerHTML = '<p>No available opportunities</p>';
        return;
    }

    const opportunitiesList = opportunities.map(opportunity => `
        <div class="opportunity-item">
            <h4>${opportunity.title}</h4>
            <p>Amount Needed: $${opportunity.amountNeeded}</p>
            <p>Expected Return: ${opportunity.expectedReturn}%</p>
            <p>Risk Level: ${opportunity.riskLevel}</p>
            <button onclick="investInOpportunity(${opportunity.id})" class="secondary-btn">Invest</button>
        </div>
    `).join('');

    container.innerHTML = opportunitiesList;
}

// Show investment modal
function showInvestmentModal() {
    const modal = document.getElementById('investmentModal');
    modal.style.display = 'block';
}

// Close modal
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function() {
        this.closest('.modal').style.display = 'none';
    }
});

// Handle investment submission
document.getElementById('investmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        amount: document.getElementById('investmentAmount').value,
        type: document.getElementById('investmentType').value,
        riskLevel: document.getElementById('riskLevel').value,
        description: document.getElementById('investmentDescription').value
    };

    try {
        const response = await fetch('/api/investor/new-investment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Investment created successfully!');
            document.getElementById('investmentModal').style.display = 'none';
            loadDashboardData(); // Refresh dashboard data
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to create investment');
        }
    } catch (error) {
        console.error('Error creating investment:', error);
        alert('Failed to create investment');
    }
});

// Invest in opportunity
async function investInOpportunity(opportunityId) {
    try {
        const response = await fetch('/api/investor/invest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ opportunityId })
        });

        if (response.ok) {
            alert('Investment successful!');
            loadDashboardData(); // Refresh dashboard data
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to invest');
        }
    } catch (error) {
        console.error('Error investing:', error);
        alert('Failed to invest');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
} 