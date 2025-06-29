# 💹 EkoPay - Wallet Application

EkoPay is a full-stack wallet application that allows users to securely deposit and withdraw money, manage their PIN, and view transaction history. The system is built with Node.js, GraphQL, TypeScript, MongoDB, and a responsive React frontend.

---

## 🔧 Technologies Used

### Backend

* Node.js
* Express.js
* TypeScript
* GraphQL (Apollo Server)
* MongoDB with Mongoose
* JWT Authentication
* Docker

### Frontend

* React + TypeScript
* Apollo Client
* Tailwind CSS
* React Router
* Toast Notifications
* Zustand


---

## 🚀 Features

### ✅ User

* Register/Login via JWT
* Secure Authentication with Guards

### ✅ Wallet

* View Wallet Details (balance, account number)
* Deposit Funds
* Withdraw Funds using PIN
* Update PIN

### ✅ Transactions

* View recent transactions
* View all transactions with history screen

---

## 🧩 GraphQL API

### Sample Queries & Mutations

#### 📅 Deposit Funds

```graphql
mutation Deposit($amount: Float!) {
  deposit(depositInput: { amount: $amount }) {
    message
    wallet {
      balance
      accountNumber
    }
  }
}
```

#### 📤 Withdraw Funds

```graphql
mutation Withdraw($amount: Float!, $pin: String!) {
  withdraw(withdrawInput: { amount: $amount, pin: $pin }) {
    message
    wallet {
      balance
    }
  }
}
```

#### 🔐 Update PIN

```graphql
mutation {
  updatePin(pinInput: { oldPin: "1234", newPin: "5678" }) {
    message
  }
}
```

#### 📊 Wallet Query

```graphql
query {
  walletByUser {
    wallet {
      _id
      accountNumber
      balance
      createdAt
    }
    transactionHistory {
      _id
      type
      amount
      createdAt
    }
  }
}
```

---

## 📱 Frontend Functionality

* Responsive layout using Tailwind CSS
* Drawer UI for Deposit, Withdraw, and Update PIN
* Toast notifications for success and error states
* View All Transactions navigation
* Apollo GraphQL integration with caching and refetching

---

## 🔐 Authentication

* JWT-based authentication
* Apollo client handles auth headers
* Protected routes for dashboard and wallet screens

---

## 💻 Local Development Setup

### Prerequisites

* Node.js & npm
* MongoDB running locally or in Docker
* Git

### Backend Setup

```bash
git clone <repo-url>
cd ekopay-backend
npm install

# Create .env file
cp .env.example .env
# Fill in JWT_SECRET and MongoDB URI

# Run the server
yarn start:dev
```

### Frontend Setup

```bash
cd ekopay-frontend
npm install

# Run development server
npm run dev
```

### MongoDB Setup (If using Docker)

```bash
docker run --name mongodb -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin mongo
```

---

## 🌐 Deployment

* GitHub and GitLab repositories configured
* Add remotes with:

```bash
git remote add origin https://github.com/<your-username>/ekopay.git
# or
git remote set-url origin https://gitlab.com/<your-username>/EkoPay.git
```

* Push with:

```bash
git push -u origin main
```

---

## ✍️ Author

**Sodiq Akintomide Muiliyu**

---
## ✍️ Links

Backend Link: 
