import { useState, useEffect } from 'react';
import Head from 'next/head';

interface User {
  id: number;
  name: string;
  level: number;
  percentage: number;
  amount: number;
  joinedDate: string;
}

const NetworkMarketingApp = () => {
  const [totalAmount, setTotalAmount] = useState<number>(1000);
  const [newUserName, setNewUserName] = useState<string>('');
  const [showAddUser, setShowAddUser] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const savedUsers = localStorage.getItem('networkUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const defaultUsers = [
        {
          id: 1,
          name: "John (Founder)",
          level: 1,
          percentage: 50,
          amount: 0,
          joinedDate: "2024-01-01"
        },
        {
          id: 2,
          name: "Sarah (Level 2)",
          level: 2,
          percentage: 30,
          amount: 0,
          joinedDate: "2024-02-15"
        },
        {
          id: 3,
          name: "Mike (Level 3)",
          level: 3,
          percentage: 20,
          amount: 0,
          joinedDate: "2024-03-20"
        }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('networkUsers', JSON.stringify(defaultUsers));
    }
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('networkUsers', JSON.stringify(users));
    }
  }, [users]);

  const calculatePercentages = (userCount: number) => {
    const percentages = [];
    
    if (userCount === 1) {
      percentages.push(100);
    } else if (userCount === 2) {
      percentages.push(70);
      percentages.push(30);
    } else {
      let remainingPercentage = 100;
      
      for (let i = 0; i < userCount; i++) {
        if (i === 0) {
          percentages.push(50);
          remainingPercentage -= 50;
        } else if (i === userCount - 1) {
          percentages.push(remainingPercentage);
        } else {
          const currentPercentage = Math.floor(remainingPercentage * 0.6);
          percentages.push(currentPercentage);
          remainingPercentage -= currentPercentage;
        }
      }
    }
    
    return percentages;
  };

  const updateUserPercentages = (userList: User[]) => {
    const percentages = calculatePercentages(userList.length);
    return userList.map((user, index) => ({
      ...user,
      percentage: percentages[index] || 0
    }));
  };

  const calculateDistribution = () => {
    const updatedUsers = updateUserPercentages(users);
    return updatedUsers.map(user => ({
      ...user,
      amount: (totalAmount * user.percentage) / 100
    }));
  };

  const distributedUsers = calculateDistribution();

  const handleDistribute = () => {
    alert('Amount distributed successfully!');
  };

  const handleAddUser = () => {
    if (newUserName.trim()) {
      const newUser: User = {
        id: Date.now(),
        name: `${newUserName} (Level ${users.length + 1})`,
        level: users.length + 1,
        percentage: 0,
        amount: 0,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      
      setUsers([...users, newUser]);
      setNewUserName('');
      setShowAddUser(false);
    }
  };

  const handleRemoveUser = (userId: number) => {
    if (users.length > 1) {
      const updatedUsers = users
        .filter(user => user.id !== userId)
        .map((user, index) => ({
          ...user,
          level: index + 1,
          name: user.name.includes('(Founder)') ? user.name : 
                user.name.split(' (Level')[0] + ` (Level ${index + 1})`
        }));
      setUsers(updatedUsers);
    }
  };

  return (
    <>
      <Head>
        <title>Network Marketing Distribution</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
              Network Marketing Distribution
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Simple chain-based amount distribution system
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <label className="text-base sm:text-lg font-semibold text-gray-700">
                Total Amount to Distribute:
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-bold text-green-600">$</span>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(Number(e.target.value))}
                  className="w-24 text-black sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleDistribute}
                className="flex-1 bg-blue-600 text-white py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base"
              >
                Distribute Amount
              </button>
              
              <button
                onClick={() => setShowAddUser(!showAddUser)}
                className="bg-green-600 text-white py-3 px-4 sm:px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm sm:text-base"
              >
                Add User
              </button>
            </div>

            {showAddUser && (
              <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter user name"
                    className="flex-1 text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddUser}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddUser(false);
                        setNewUserName('');
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              Distribution Chain
            </h2>
            
            {distributedUsers.map((user, index) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-blue-500"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-base sm:text-lg">
                        {user.level}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                        {user.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Joined: {user.joinedDate}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                    <div className="text-left sm:text-right">
                      <div className="text-xl sm:text-2xl font-bold text-green-600">
                        ${user.amount.toFixed(2)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {user.percentage}% of total
                      </div>
                    </div>
                    
                    {users.length > 1 && (
                      <button
                        onClick={() => handleRemoveUser(user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-600 transition-colors ml-2 sm:ml-0"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 sm:mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${user.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mt-4 sm:mt-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              Distribution Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  ${totalAmount.toFixed(2)}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Total Amount</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  {distributedUsers.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">
                  ${distributedUsers.reduce((sum, user) => sum + user.amount, 0).toFixed(2)}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Total Distributed</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mt-4 sm:mt-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              Network Hierarchy
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
              {distributedUsers.map((user, index) => (
                <div key={user.id} className="text-center">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                  }`}>
                    {user.level}
                  </div>
                  <div className="mt-2 text-xs text-black sm:text-sm font-medium">{user.name.split(' ')[0]}</div>
                  <div className="text-xs text-gray-500">{user.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NetworkMarketingApp;