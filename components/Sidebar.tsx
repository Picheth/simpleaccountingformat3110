
import React from 'react';

interface NavItem {
    name: string;
    icon: React.FC;
}

interface SidebarProps {
    navItems: NavItem[];
    activePage: string;
    setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, activePage, setActivePage }) => {
    return (
        <aside className="w-64 bg-dark text-white flex flex-col">
            <div className="p-4 border-b border-gray-700">
                <h1 className="text-2xl font-bold">SME Accounting</h1>
            </div>
            <nav className="flex-grow p-2">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.name} className="mb-1">
                            <button
                                onClick={() => setActivePage(item.name)}
                                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                                    activePage === item.name
                                        ? 'bg-primary text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <item.icon />
                                <span className="ml-4">{item.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
