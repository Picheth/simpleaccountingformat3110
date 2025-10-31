import React from 'react';
import { Staff } from '../types';

interface StaffProps {
  staff: Staff[];
}

const StaffPage: React.FC<StaffProps> = ({ staff }) => {
    return (
    <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Staff Management</h1>
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="w-full min-w-max text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th rowSpan={2} className="px-2 py-3 border">No.</th>
                        <th rowSpan={2} className="px-2 py-3 border">Employee ID</th>
                        <th rowSpan={2} className="px-2 py-3 border">Name (Khmer)</th>
                        <th rowSpan={2} className="px-2 py-3 border">Name (English)</th>
                        <th rowSpan={2} className="px-2 py-3 border">Gender</th>
                        <th rowSpan={2} className="px-2 py-3 border">Date of Birth</th>
                        <th className="px-2 py-3 border text-center">Gross Salary (KHR)</th>
                        <th className="px-2 py-3 border text-center">Pension Deduction (2%) (KHR)</th>
                        <th className="px-2 py-3 border text-center">Net Salary (KHR)</th>
                    </tr>
                </thead>
                <tbody>
                    {staff.map((s, index) => {
                        const pensionRiel = s.salaryRiel * 0.02;
                        const netRiel = s.salaryRiel - pensionRiel;
                        return (
                            <tr key={s.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-2 py-2 border">{index + 1}</td>
                                <td className="px-2 py-2 border">{s.employeeId}</td>
                                <td className="px-2 py-2 border">{s.nameKhmer}</td>
                                <td className="px-2 py-2 border">{s.nameEnglish}</td>
                                <td className="px-2 py-2 border">{s.gender}</td>
                                <td className="px-2 py-2 border">{s.dob}</td>
                                <td className="px-2 py-2 border text-right">{s.salaryRiel.toLocaleString()} ៛</td>
                                <td className="px-2 py-2 border text-right text-red-500">({pensionRiel.toLocaleString()} ៛)</td>
                                <td className="px-2 py-2 border text-right font-bold">{netRiel.toLocaleString()} ៛</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default StaffPage;