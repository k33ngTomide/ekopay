// src/pages/Dashboard.tsx
import { useAuthStore } from '../store/auth';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import Drawer from '../components/Drawer';
import { useQuery, useMutation, gql } from '@apollo/client';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import LargeButton from '../components/LargeButton';
import LOGO from '../assets/ekopay_logo.png'; // Adjust the path as necessary

const GET_DASHBOARD_DATA = gql`
 query GetDashboardData {
  me {
    _id
    fullName
    email
    phone
  }
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
`;

const DEPOSIT_MUTATION = gql`
  mutation Deposit($amount: Float!) {
    deposit(depositInput: { amount: $amount }) {
      message
      wallet {
        accountNumber
      }
    }
  }
`;

const WITHDRAW_MUTATION = gql`
  mutation Withdraw($amount: Float!, $pin: String!) {
    withdraw(withdrawInput: { amount: $amount, pin: $pin }) {
      message
      wallet {
        _id
        accountNumber
        balance
        createdAt
      }
    }
  }
`;

const UPDATE_PIN_MUTATION = gql`
  mutation UpdatePin($oldPin: String!, $newPin: String!) {
    updatePin(oldPin: $oldPin, newPin: $newPin) {
      success
      message
    }
  }
`;

export default function Dashboard() {

  const { data, loading, error } = useQuery(GET_DASHBOARD_DATA);

  const [depositMutation] = useMutation(DEPOSIT_MUTATION, {
    
    refetchQueries: [{ query: GET_DASHBOARD_DATA }],
    onCompleted: (data) => {
      if (data.deposit.message === 'Deposit successful') {
        toast.success('Deposit successful!');
        setDrawerOpen(false);
        resetForm();
      } else {
        toast.error(data.deposit.message || 'Deposit failed.');
      }
    },
    onError: (err) => toast.error(err.message || 'Deposit failed.'),
  });

  const [withdrawMutation] = useMutation(WITHDRAW_MUTATION, {
    refetchQueries: [{ query: GET_DASHBOARD_DATA }],
    onCompleted: (data) => {
      if (data.withdraw.message === 'Withdrawal successful') {
        toast.success('Withdrawal successful!');
        setDrawerOpen(false);
        resetForm();
      } else {
        toast.error(data.withdraw.message || 'Withdrawal failed.');
      }
    },
    onError: (err) => toast.error(err.message || 'Withdrawal failed.'),
  });

  const [updatePinMutation] = useMutation(UPDATE_PIN_MUTATION, {
    onCompleted: (data) => {
      if (data.updatePin.success) {
        toast.success('PIN updated successfully!');
        setDrawerOpen(false);
        resetForm();
      } else {
        toast.error(data.updatePin.message || 'Failed to update PIN.');
      }
    },
    onError: (err) => toast.error(err.message || 'Failed to update PIN.'),
  });

  const { clearToken } = useAuthStore();
  const navigate = useNavigate();

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'DEPOSIT' | 'WITHDRAW' | 'UPDATE_PIN' | null>(null);
  const [form, setForm] = useState({
    amount: '',
    pin: '',
    oldPin: '',
    newPin: '',
  });

  const resetForm = () => {
    setForm({ amount: '', pin: '', oldPin: '', newPin: '' });
  };

  const logout = () => {
    clearToken();
    navigate('/login');
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) {
    console.error("GraphQL Error:", error.message);
    toast.error("Failed to load dashboard data. Please try again later.");
    return <p className="p-4 text-red-600">Failed to load data.</p>;
  }

  const { me, walletByUser } = data || {};

  return (
    <div className="p-6 font-montserrat min-h-screen bg-gray-300">
      <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left mb-4">
        <img
          src={LOGO}
          alt="Ekopay Icon"
          className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px]"
        />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-montserrat">
          Ekopay
        </h1>
      </div>

      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
        Welcome, {me?.fullName}
      </h1>


      <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
        <p className="text-gray-600 mb-2">Account Number</p>
        <h2 className="text-xl font-semibold">{walletByUser?.wallet?.accountNumber}</h2>

        <Button className="absolute border bg-red-600 text-red-600 hover:bg-red-200 right-10" onClick={logout}>Logout</Button>

        <p className="text-gray-600 mt-4 mb-2">Current Balance</p>
        <h1 className="text-3xl font-bold text-green-600">₦{walletByUser?.wallet?.balance?.toLocaleString() || 0}</h1>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <LargeButton onClick={() => { setDrawerType('DEPOSIT'); setDrawerOpen(true); }}>Deposit</LargeButton>
          <LargeButton className="border" onClick={() => { setDrawerType('WITHDRAW'); setDrawerOpen(true); }}>Withdraw</LargeButton>
          <LargeButton className="border" onClick={() => { setDrawerType('UPDATE_PIN'); setDrawerOpen(true); }}>Update PIN</LargeButton>
          <LargeButton className="border" onClick={() => toast.info("Transfer functionality coming soon.")}>Transfer</LargeButton>
          
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
        <ul className="space-y-3">
          {walletByUser.transactionHistory.slice(0, 5).map(txn => (
            <li key={txn._id} className="flex justify-between text-sm border-b pb-2">
              <span className={`font-medium ${txn.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}>{txn.type}</span>
              <span>₦{txn.amount.toLocaleString()}</span>
              <span className="text-gray-500">{format(new Date(txn.createdAt), 'dd MMM, yyyy')}</span>
            </li>
          ))}
        </ul>

        {walletByUser.transactionHistory.length === 0 && (
          <p className="text-gray-500 mt-20 font-montserrat self-center">No transactions found.</p>
        )}

        {walletByUser.transactionHistory.length > 5 && (
          <Button className="mt-4" onClick={() => navigate('/transactions')}>
            See More
          </Button>
        )}
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          resetForm();
        }}
        title={drawerType === 'DEPOSIT' ? 'Deposit Funds' : drawerType === 'WITHDRAW' ? 'Withdraw Funds' : 'Update PIN'}
      >
        <div className="p-4 space-y-4">
          {drawerType === 'DEPOSIT' && (
            <>
              <label className="block mb-2 text-sm font-medium">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full border rounded px-4 py-2"
                placeholder="Enter amount"
              />
            </>
          )}

          {drawerType === 'WITHDRAW' && (
            <>
              <label className="block mb-2 text-sm font-medium">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full border rounded px-4 py-2"
                placeholder="Enter amount"
              />

              <label className="block mb-2 text-sm font-medium">PIN</label>
              <input
                type="password"
                name="pin"
                value={form.pin}
                onChange={(e) => setForm({ ...form, pin: e.target.value })}
                className="w-full border rounded px-4 py-2"
                placeholder="Enter your PIN"
                autoSave='off'
                autoComplete='off'
              />
            </>
          )}

          {drawerType === 'UPDATE_PIN' && (
            <>
              <label className="block mb-2 text-sm font-medium">Current PIN</label>
              <input
                type="password"
                name="oldPin"
                value={form.oldPin}
                onChange={(e) => setForm({ ...form, oldPin: e.target.value })}
                className="w-full border rounded px-4 py-2"
                placeholder="Enter current PIN"
              />

              <label className="block mb-2 text-sm font-medium">New PIN</label>
              <input
                type="password"
                name="newPin"
                value={form.newPin}
                onChange={(e) => setForm({ ...form, newPin: e.target.value })}
                className="w-full border rounded px-4 py-2"
                placeholder="Enter new PIN"
              />
            </>
          )}

          <Button
            className="w-full"
            onClick={() => {
              if (drawerType === 'DEPOSIT') {
                if (!form.amount) return toast.info('Please enter an amount.');
                depositMutation({ variables: { amount: parseFloat(form.amount) } });
              } else if (drawerType === 'WITHDRAW') {
                if (!form.amount || !form.pin) return toast.info('Enter amount and PIN.');
                withdrawMutation({ variables: { amount: parseFloat(form.amount), pin: form.pin } });
              } else if (drawerType === 'UPDATE_PIN') {
                if (!form.oldPin || !form.newPin) return toast.info('Fill in both PIN fields.');
                updatePinMutation({ variables: { oldPin: form.oldPin, newPin: form.newPin } });
              }
            }}
          >
            Submit
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
