# MicroLoan Platform

A web-based microfinance platform that connects borrowers, lenders, and investors in the agricultural and startups sector. This platform facilitates loan applications, investments, and loan management with a focus on supporting farmers and agricultural businesses.

## Features

### For Borrowers
- User-friendly loan application process
- Real-time loan status tracking
- Payment schedule management
- Loan history and performance monitoring
- Profile management

### For Lenders
- Loan application review and approval system
- Risk assessment tools
- Portfolio management
- Loan performance analytics
- Borrower verification

### For Investors
- Investment opportunity discovery
- Portfolio tracking
- Investment history
- Performance metrics
- Risk analysis

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: In-memory storage 

## Installation

1. Clone the repository:
```bash
git clone https://github.com/saranyaray/microloan-lending_software.git
cd microloan-lending-software
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The application will be available at `http://localhost:5002`

## Project Structure

```
microloan-platform/
├── public/
│   ├── borrower-dashboard.html
│   ├── lender-dashboard.html
│   ├── investor-dashboard.html
│   ├── login.html
│   ├── register.html
│   ├── styles.css
│   ├── borrower-dashboard.js
│   ├── lender-dashboard.js
│   └── investor-dashboard.js
├── server.js
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile

### Borrower Endpoints
- `GET /api/borrower/active-loans` - Get active loans
- `GET /api/borrower/loan-history` - Get loan history
- `GET /api/borrower/payment-schedule` - Get payment schedule
- `POST /api/borrower/apply-loan` - Apply for a loan

### Lender Endpoints
- `GET /api/lender/loan-requests` - Get loan applications
- `GET /api/lender/active-loans` - Get active loans
- `GET /api/lender/loan-performance` - Get loan performance stats
- `POST /api/lender/approve-loan/:loanId` - Approve a loan
- `POST /api/lender/reject-loan/:loanId` - Reject a loan

### Investor Endpoints
- `GET /api/investor/portfolio` - Get investment portfolio
- `GET /api/investor/active-investments` - Get active investments
- `GET /api/investor/investment-history` - Get investment history
- `POST /api/investor/invest` - Make an investment

## Security Features

- JWT-based authentication
- Password hashing
- Role-based access control
- Input validation
- Secure session management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Farmers and agricultural businesses for their valuable feedback
- Open source community for their contributions
- Microfinance institutions for their insights
