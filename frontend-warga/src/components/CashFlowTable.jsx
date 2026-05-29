import React from "react";

const CashFlowTable = ({ transactions }) => {
  const formatRp = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka || 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
        Arus Kas Terakhir
      </h2>
      <table className="w-full text-left">
        <tbody>
          {transactions.map((item) => (
            <tr key={item._id} className="border-b last:border-0">
              <td className="py-2 text-sm text-gray-500">
                {new Date(item.date).toLocaleDateString("id-ID")}
              </td>
              <td className="py-2 text-sm font-medium">{item.description}</td>
              <td
                className={`py-2 text-right text-sm font-bold ${item.type === "Masuk" ? "text-green-600" : "text-red-600"}`}
              >
                {item.type === "Masuk" ? "+" : "-"}
                {formatRp(item.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default CashFlowTable;
