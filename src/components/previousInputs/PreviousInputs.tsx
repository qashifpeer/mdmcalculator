import React from "react";

const PreviousInputs: React.FC = () => {
  return (
    <div className="overflow-x-auto p-2">
      <table className="min-w-1/3 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-700">
            <th className="border border-gray-300 px-4 py-2 text-left">
              Ingredients
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Pre-Primary
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Primary
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Middle
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2">
              Opening Balance
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="number"
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="number"
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="number"
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </td>
          </tr>

          <tr>
            <td className="border border-gray-300 px-4 py-2">
              Income Received
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="number"
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="number"
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="number"
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </td>
          </tr>
        </tbody>
        <thead>
          <tr className="bg-gray-700">
            <th className="border border-gray-300 px-4 py-2 text-left">
              Rice Details
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center"></th>
            <th className="border border-gray-300 px-4 py-2 text-center"></th>
            <th className="border border-gray-300 px-4 py-2 text-center"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2">
              Previous Balance
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="number"
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="number"
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="number"
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </td>
          </tr>

          <tr>
            <td className="border border-gray-300 px-4 py-2">Rice Lifted</td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="number"
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="number"
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="number"
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PreviousInputs;
