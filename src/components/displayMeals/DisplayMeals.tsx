'use client'

import { useMeals } from '@/contexts/MealsContext'

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate)
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  return `${dd}-${mm}-${yyyy}`
}

export default function DisplayMeals() {
  const { meals, deleteMeal } = useMeals()

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-xl font-semibold mb-4">Meals Report</h2>
      {meals.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">S.NO</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Pre-Primary</th>
                <th className="border px-4 py-2">Primary</th>
                <th className="border px-4 py-2">Middle</th>
              </tr>
            </thead>
            <tbody>
              {meals.map((entry, index) => (
                <tr
                  key={`${entry.date}-${index}`}
                  onDoubleClick={() => {
                    if (
                      confirm(
                        `Are you sure you want to delete entry for ${formatDate(entry.date)}?`
                      )
                    ) {
                      deleteMeal(entry)
                    }
                  }}
                  className="hover:bg-red-50 cursor-pointer transition-colors duration-200"
                  title="Double-click to delete"
                >
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2 text-center">{formatDate(entry.date)}</td>
                  <td className="border px-4 py-2 text-center">{entry.prePrimary}</td>
                  <td className="border px-4 py-2 text-center">{entry.primary}</td>
                  <td className="border px-4 py-2 text-center">{entry.middle}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">
            Double-click any row to delete it.
          </p>
        </div>
      ) : (
        <p className="text-gray-600">No MEALS data found.</p>
      )}
    </div>
  )
}
