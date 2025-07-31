'use client'

import React from 'react'

const DisplayBalances: React.FC = () => {
  return (
    <div className="p-4 space-y-8">
      {/* Ingredients Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Section</th>
                <th className="border px-4 py-2">Opening Balance</th>
                <th className="border px-4 py-2">Income Received</th>
                <th className="border px-4 py-2">Avl Balance</th>
                <th className="border px-4 py-2">Expenditure</th>
                <th className="border px-4 py-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {['Pre-Primary', 'Primary', 'Middle'].map((section, idx) => (
                <tr key={idx}>
                  <td className="border px-4 py-2 font-medium">{section}</td>
                  <td className="border px-4 py-2">₹0.00</td>
                  <td className="border px-4 py-2">₹0.00</td>
                  <td className="border px-4 py-2">₹0.00</td>
                  <td className="border px-4 py-2">₹0.00</td>
                  <td className="border px-4 py-2">₹0.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rice Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Rice Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Section</th>
                <th className="border px-4 py-2">Opening Balance</th>
                <th className="border px-4 py-2">Rice Lifted</th>
                <th className="border px-4 py-2">Rice Available</th>
                <th className="border px-4 py-2">Expenditure</th>
                <th className="border px-4 py-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {['Pre-Primary', 'Primary', 'Middle'].map((section, idx) => (
                <tr key={idx}>
                  <td className="border px-4 py-2 font-medium">{section}</td>
                  <td className="border px-4 py-2">0.00 kg</td>
                  <td className="border px-4 py-2">0.00 kg</td>
                  <td className="border px-4 py-2">0.00 kg</td>
                  <td className="border px-4 py-2">0.00 kg</td>
                  <td className="border px-4 py-2">0.00 kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DisplayBalances
