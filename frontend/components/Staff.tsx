import React, { useState, useMemo } from 'react';
import { Staff } from '../types';
import Modal from './Modal';

interface StaffProps {
  staff: Staff[];
  addStaff: (staff: Omit<Staff, 'id'>) => void;
  updateStaff: (staff: Staff) => void;
  deleteStaff: (id: string) => void;
}

const StaffForm: React.FC<{
    onSave: (data: Omit<Staff, 'id'>) => void;
    onClose: () => void;
    initialData?: Staff | null;
}> = ({ onSave, onClose, initialData }) => {
    const [formData, setFormData] = useState<Omit<Staff, 'id'>>(() => {
        if (initialData) {
            const { id, ...rest } = initialData;
            return rest;
        }
        return {
            employeeId: '',
            nameKhmer: '',
            nameEnglish: '',
            gender: 'Male',
            dob: '',
            salaryRiel: 0,
            salaryUsd: 0
        };
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['salaryRiel', 'salaryUsd'].includes(name) ? Number(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                    <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (Khmer)</label>
                <input
                    type="text"
                    name="nameKhmer"
                    value={formData.nameKhmer}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
                <input
                    type="text"
                    name="nameEnglish"
                    value={formData.nameEnglish}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gross Salary (KHR)</label>
                    <input
                        type="number"
                        name="salaryRiel"
                        value={formData.salaryRiel}
                        onChange={handleChange}
                        required
                        min="0"
                        step="1000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gross Salary (USD)</label>
                    <input
                        type="number"
                        name="salaryUsd"
                        value={formData.salaryUsd}
                        onChange={handleChange}
                        required
                        min="0"
                        step="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    {initialData ? 'Update' : 'Add'} Staff
                </button>
            </div>
        </form>
    );
};

const StaffPage: React.FC<StaffProps> = ({ staff, addStaff, updateStaff, deleteStaff }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

    const filteredStaff = useMemo(() => {
        if (!searchTerm) return staff;
        
        const lowerSearch = searchTerm.toLowerCase();
        return staff.filter(s =>
            s.employeeId.toLowerCase().includes(lowerSearch) ||
            s.nameKhmer.toLowerCase().includes(lowerSearch) ||
            s.nameEnglish.toLowerCase().includes(lowerSearch)
        );
    }, [staff, searchTerm]);

    const handleAddStaff = (staffData: Omit<Staff, 'id'>) => {
        addStaff(staffData);
    };

    const handleEditStaff = (staffData: Omit<Staff, 'id'>) => {
        if (editingStaff) {
            updateStaff({ ...staffData, id: editingStaff.id });
        }
    };

    const handleEdit = (s: Staff) => {
        setEditingStaff(s);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStaff(null);
    };

    return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
            <div className="flex gap-3">
                <input
                    type="text"
                    placeholder="Search by ID, name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
                <button
                    onClick={() => { setEditingStaff(null); setIsModalOpen(true); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Staff
                </button>
            </div>
        </div>

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
                        <th rowSpan={2} className="px-2 py-3 border text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStaff.length === 0 ? (
                        <tr>
                            <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                                {searchTerm ? 'No staff members found matching your search.' : 'No staff members yet. Click "Add New Staff" to get started.'}
                            </td>
                        </tr>
                    ) : (
                        filteredStaff.map((s, index) => {
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
                                    <td className="px-2 py-2 border text-center">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => handleEdit(s)}
                                                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteStaff(s.id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>

        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}>
            <StaffForm
                onSave={editingStaff ? handleEditStaff : handleAddStaff}
                onClose={handleCloseModal}
                initialData={editingStaff}
            />
        </Modal>
    </div>
  );
};

export default StaffPage;