import { gql, useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const GET_ALL_TRANSACTIONS = gql`
  query GetWalletAndTransactions {
    walletByUser {
      transactionHistory {
        _id
        amount
        type
        createdAt
      }
    }
  }
`;

export default function Transactions() {
  const { data, loading, error } = useQuery(GET_ALL_TRANSACTIONS);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) {
    console.error(error);
    toast.error('Failed to load transactions');
    return null;
  }

  const transactions = data?.walletByUser?.transactionHistory ?? [];

  return (
    <div className="p-6 font-montserrat min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">All Transactions</h1>
      <div className="bg-white rounded-2xl p-6 shadow-md max-h-[70vh] overflow-y-auto">
        {transactions.length === 0 ? (
          <p className="text-gray-600">No transactions yet.</p>
        ) : (
          <ul className="space-y-3">
            {transactions.map((txn: any) => (
              <li key={txn._id} className="flex justify-between text-sm border-b pb-2">
                <span className={`font-medium ${txn.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}>
                  {txn.type}
                </span>
                <span>₦{txn.amount.toLocaleString()}</span>
                <span className="text-gray-500">{format(new Date(txn.createdAt), 'dd MMM, yyyy')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
