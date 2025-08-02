'use client'

import React from 'react'
import { useCalculate } from '@/contexts/CalculateContext' // Update path as needed
import { useRiceCalculate } from '@/contexts/RiceContext' // Update path as needed

const DisplayBalances: React.FC = () => {
  const { data } = useCalculate()
  const { riceData} = useRiceCalculate()

  

  return (
    <div className="p-4 space-y-8">
      {/* Ingredients Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-xs text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-2">Section</th>
                <th className="border px-2 py-2">Opening Balance</th>
                <th className="border px-2 py-2">Income Received</th>
                <th className="border px-2 py-2">Avl Balance</th>
                <th className="border px-2 py-2">Expenditure</th>
                <th className="border px-2 py-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-2 font-medium">{row.section}</td>
                  <td className="border px-2 py-2">₹{row.openingBalance.toFixed(2)}</td>
                  <td className="border px-2 py-2">₹{row.incomeReceived.toFixed(2)}</td>
                  <td className="border px-2 py-2">₹{row.avlBalance.toFixed(2)}</td>
                  <td className="border px-2 py-2">₹{row.expenditure.toFixed(2)}</td>
                  <td className="border px-2 py-2">₹{row.balance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rice Table (optional) */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Rice Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-xs text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-2">Section</th>
                <th className="border px-2 py-2">Opening Balance</th>
                <th className="border px-2 py-2">Rice Lifted</th>
                <th className="border px-2 py-2">Rice Available</th>
                <th className="border px-2 py-2">Expenditure</th>
                <th className="border px-2 py-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {riceData.map((row,idx)=> (
               <tr key={idx}>
                  <td className="border px-2 py-2 font-medium">{row.section}</td>
                  <td className="border px-2 py-2">{row.openingBalance.toFixed(2)} kg</td>
                  <td className="border px-2 py-2">{row.riceLifted.toFixed(2)} kg</td>
                  <td className="border px-2 py-2">{row.riceAvailable.toFixed(2)} kg</td>
                  <td className="border px-2 py-2">{row.expenditure.toFixed(2)} kg</td>
                  <td className="border px-2 py-2">{row.balance.toFixed(2)} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Final Calculations Table */}
     
      
    </div>
  )
}

export default DisplayBalances
