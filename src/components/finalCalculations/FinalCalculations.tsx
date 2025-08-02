'use client';

import React from 'react';
import { useCalculate } from '@/contexts/CalculateContext';
import { useRiceCalculate } from '@/contexts/RiceContext';

const FinalCalculations = () => {
  const { data } = useCalculate();
  const { riceData } = useRiceCalculate();

  // Financial totals
  const totalOpening = data.reduce((sum, d) => sum + d.openingBalance, 0);
  const totalReceived = data.reduce((sum, d) => sum + d.incomeReceived, 0);
  const totalAvailable = data.reduce((sum, d) => sum + d.avlBalance, 0);
  const totalExpenditure = data.reduce((sum, d) => sum + d.expenditure, 0);
  const totalBalance = data.reduce((sum, d) => sum + d.balance, 0);

  // Rice totals
  const totalRiceOpening = riceData.reduce((sum, d) => sum + d.openingBalance, 0);
  const totalRiceReceived = riceData.reduce((sum, d) => sum + d.riceLifted, 0);
  const totalRiceAvailable = riceData.reduce((sum, d) => sum + d.riceAvailable, 0);
  const totalRiceExpenditure = riceData.reduce((sum, d) => sum + d.expenditure, 0);
  const totalRiceBalance = riceData.reduce((sum, d) => sum + d.balance, 0);

  return (
    <div className="p-4 shadow-md rounded-lg max-w-4xl flex justify-center items-center gap-2 mb-3">
      {/* Total Expenses Table */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Total Expenses
        </h2>
        <table className="min-w-full table-auto text-sm border border-gray-300">
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Opening Balance</td>
              <td className="px-4 py-2">₹{totalOpening.toFixed(2)}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Total Received Amount</td>
              <td className="px-4 py-2">₹{totalReceived.toFixed(2)}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Total Available Amount</td>
              <td className="px-4 py-2">₹{totalAvailable.toFixed(2)}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Total Expenditure</td>
              <td className="px-4 py-2">₹{totalExpenditure.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">Closing Balance</td>
              <td className="px-4 py-2">₹{totalBalance.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Total Rice Consumption Table */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Total Rice Consumption
        </h2>
        <table className="min-w-full table-auto text-sm border border-gray-300">
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Opening Balance</td>
              <td className="px-4 py-2">{totalRiceOpening.toFixed(2)} kg</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Total Rice Lifted</td>
              <td className="px-4 py-2">{totalRiceReceived.toFixed(2)} kg</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Total Rice Available</td>
              <td className="px-4 py-2">{totalRiceAvailable.toFixed(2)} kg</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Total Rice Consumed</td>
              <td className="px-4 py-2">{totalRiceExpenditure.toFixed(2)} kg</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">Closing Balance</td>
              <td className="px-4 py-2">{totalRiceBalance.toFixed(2)} kg</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinalCalculations;
