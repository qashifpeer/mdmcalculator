'use client'

import React from 'react'
import { useInputBalances } from '@/contexts/InputBalancesContext'

const sectionLabels = {
  prePrimary: 'Pre-Primary',
  primary: 'Primary',
  middle: 'Middle',
} as const

type SectionKey = keyof typeof sectionLabels

const PreviousInputs: React.FC = () => {
  const context = useInputBalances()

  // Optional chaining fallback
  if (!context) return <p className="text-red-500">Loading context...</p>

  const { ingredientsData, riceData, updateIngredient, updateRice } = context
  const sectionKeys: SectionKey[] = ['prePrimary', 'primary', 'middle']

  return (
    <section className="p-4 space-y-2">
      {/* Ingredients Table */}
      <div>
        <h2 className="text-sm font-semibold mb-1">Ingredients</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-xs text-center">
            <thead className="bg-gray-600 text-orange-500">
              <tr>
                <th className="border px-4 py-0.5">Details</th>
                {sectionKeys.map((key) => (
                  <th key={key} className="border px-4 py-2">{sectionLabels[key]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['openingBalance', 'incomeReceived'].map((field) => (
                <tr key={field}>
                  <td className="border px-4 py-0.5 font-medium capitalize bg-gray-200">{field.replace(/([A-Z])/g, ' $1')}</td>
                  {sectionKeys.map((key) => (
                    <td key={`${key}-${field}`} className="border px-4 py-0.5">
                      <input
                        type="text"
                        className="w-full px-2 py-0.5 border rounded"
                        value={ingredientsData?.[key]?.[field as keyof typeof ingredientsData[SectionKey]] || ''}
                        onChange={(e) => updateIngredient(key, field as 'openingBalance' | 'incomeReceived', e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rice Table */}
      <div>
        <h2 className="text-sm font-semibold mb-1">Rice Details (kg)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-xs text-center">
            <thead className="bg-gray-600 text-orange-500">
              <tr>
                <th className="border px-4 py-0.5">Details</th>
                {sectionKeys.map((key) => (
                  <th key={key} className="border px-4 py-2">{sectionLabels[key]}</th>
                ))}
              </tr>
            </thead>
            <tbody className=''>
              {['previousBalance', 'riceLifted'].map((field) => (
                <tr key={field}>
                  <td className="border px-4 py-0.5 font-medium capitalize bg-gray-200">{field.replace(/([A-Z])/g, ' $1')}</td>
                  {sectionKeys.map((key) => (
                    <td key={`${key}-${field}`} className="border px-4 py-0.5">
                      <input
                        type="text"
                        className="w-full px-2 py-0.5 border rounded"
                        value={riceData?.[key]?.[field as keyof typeof riceData[SectionKey]] || ''}
                        onChange={(e) => updateRice(key, field as 'previousBalance' | 'riceLifted', e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default PreviousInputs
