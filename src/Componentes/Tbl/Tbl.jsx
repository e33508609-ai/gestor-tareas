import React from "react";

export const Tbl = ({ columns = [], data = [] }) => {
  return (
    <div className="overflow-x-auto mt-6 rounded-2xl shadow-lg">
      <table className="min-w-full border border-[#E4E7EB] rounded-2xl overflow-hidden">
        <thead className="bg-[#0e54e2] text-white">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-[#E4E7EB]">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-[#F5F7FA] transition-all duration-200 border-b border-[#E4E7EB] last:border-b-0"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 text-[#1a1a1a] text-sm font-normal"
                  >
                  
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 text-[#9AA2B1] italic bg-[#F5F7FA]"
              >
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
