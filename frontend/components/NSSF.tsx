
import React from 'react';

const NSSF: React.FC = () => {
  return (
    <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">NSSF (National Social Security Fund)</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">This section is for managing NSSF contributions. The feature is currently under development.</p>
            <h3 className="text-lg font-semibold mt-4">Contribution Details:</h3>
            <ul className="list-disc list-inside text-gray-600">
                <li>Employer Contribution: Details on percentage and calculation.</li>
                <li>Employee Contribution: Details on percentage and calculation.</li>
                <li>Monthly submission report generation.</li>
            </ul>
        </div>
    </div>
  );
};

export default NSSF;
