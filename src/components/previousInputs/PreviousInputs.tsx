'use client'

import React, { useState } from 'react'

const sections = ['Pre-Primary', 'Primary', 'Middle']

const PreviousInputs: React.FC = () => {
  const [ingredientsData, setIngredientsData] = useState(
    sections.map(() => ({
      openingBalance: '',
      incomeReceived: '',
    }))
  )

  const [riceData, setRiceData] = useState(
    sections.map(() => ({
      previousBalance: '',
      riceLifted: '',
    }))
  )

  const handleIngredientChange = (sectionIndex: number, field: string, value: string) => {
    const updated = [...ingredientsData]
    updated[sectionIndex][field as keyof typeof updated[0]] = value
    setIngredientsData(updated)
  }

  const handleRiceChange = (sectionIndex: number, field: string, value: string) => {
    const updated = [...riceData]
    updated[sectionIndex][field as keyof typeof updated[0]] = value
    setRiceData(updated)
  }

  return (
    <div className="p-4 space-y-8">
      {/* Ingredients Input Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Details</th>
                {sections.map((section, idx) => (
                  <th key={idx} className="border px-4 py-2">{section}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-medium">Opening Balance</td>
                {ingredientsData.map((data, idx) => (
                  <td key={idx} className="border px-4 py-2">
                    <input
                      type="text"
                      className="w-full px-2 py-1 border rounded"
                      value={data.openingBalance}
                      onChange={(e) =>
                        handleIngredientChange(idx, 'openingBalance', e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">Income Received</td>
                {ingredientsData.map((data, idx) => (
                  <td key={idx} className="border px-4 py-2">
                    <input
                      type="text"
                      className="w-full px-2 py-1 border rounded"
                      value={data.incomeReceived}
                      onChange={(e) =>
                        handleIngredientChange(idx, 'incomeReceived', e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Rice Input Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Rice Details (kg)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Details</th>
                {sections.map((section, idx) => (
                  <th key={idx} className="border px-4 py-2">{section}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-medium">Previous Balance</td>
                {riceData.map((data, idx) => (
                  <td key={idx} className="border px-4 py-2">
                    <input
                      type="text"
                      className="w-full px-2 py-1 border rounded"
                      value={data.previousBalance}
                      onChange={(e) =>
                        handleRiceChange(idx, 'previousBalance', e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">Rice Lifted</td>
                {riceData.map((data, idx) => (
                  <td key={idx} className="border px-4 py-2">
                    <input
                      type="text"
                      className="w-full px-2 py-1 border rounded"
                      value={data.riceLifted}
                      onChange={(e) =>
                        handleRiceChange(idx, 'riceLifted', e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PreviousInputs
