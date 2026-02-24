import { type ComponentType, type SVGProps, lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    HomeIcon,
    ShoppingBagIcon,
    TagIcon,
    UsersIcon,
    InboxIcon,
    Bars3Icon,
    XMarkIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { type AdminSection, AdminSectionContext } from '../../context/AdminSectionContext';

const AdminDashboard = lazy(() => import('../../pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('../../pages/admin/AdminProducts'));
const AdminProductHistory = lazy(() => import('../../pages/admin/AdminProductHistory'));
const AdminCategories = lazy(() => import('../../pages/admin/AdminCategories'));
const AdminOrders = lazy(() => import('../../pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('../../pages/admin/AdminUsers'));
const AdminAnalytics = lazy(() => import('../../pages/admin/AdminAnalytics'));

const STORAGE_KEY = 'admin_active_section';

const navigation: Array<{ name: string; section: AdminSection; icon: ComponentType<SVGProps<SVGSVGElement>> }> = [
    { name: 'Dashboard', section: 'dashboard', icon: HomeIcon },
    { name: 'Produits', section: 'products', icon: ShoppingBagIcon },
    { name: 'Categories', section: 'categories', icon: TagIcon },
    { name: 'Commandes', section: 'orders', icon: InboxIcon },
    { name: 'Utilisateurs', section: 'users', icon: UsersIcon },
    { name: 'Analytics', section: 'analytics', icon: ChartBarIcon },
];

const isAdminSection = (value: string | null): value is AdminSection => {
    return (
        value === 'dashboard' ||
        value === 'products' ||
        value === 'product-history' ||
        value === 'categories' ||
        value === 'orders' ||
        value === 'users' ||
        value === 'analytics'
    );
};

const renderSection = (section: AdminSection) => {
    switch (section) {
        case 'dashboard':
            return <AdminDashboard />;
        case 'products':
            return <AdminProducts />;
        case 'product-history':
            return <AdminProductHistory />;
        case 'categories':
            return <AdminCategories />;
        case 'orders':
            return <AdminOrders />;
        case 'users':
            return <AdminUsers />;
        case 'analytics':
            return <AdminAnalytics />;
        default:
            return <AdminDashboard />;
    }
};

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [section, setSection] = useState<AdminSection>(() => {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        return isAdminSection(saved) ? saved : 'dashboard';
    });
    const { logout } = useAuth();

    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY, section);
    }, [section]);

    const currentSection = useMemo(() => renderSection(section), [section]);

    const handleSectionChange = (nextSection: AdminSection) => {
        setSection(nextSection);
        setSidebarOpen(false);
    };

    return (
        <AdminSectionContext.Provider value={{ section, setSection: handleSectionChange }}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row">
                <div className="md:hidden flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
                    <Link
                        to="/"
                        className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
                    >
                        NexusCart Admin
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
                    >
                        {sidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                    </button>
                </div>

                <div
                    className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
                >
                    <div className="h-full flex flex-col pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-6 mb-8 hidden md:flex">
                            <Link
                                to="/"
                                className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
                            >
                                NexusCart
                            </Link>
                        </div>

                        <nav className="mt-5 flex-1 px-4 space-y-2">
                            {navigation.map((item) => {
                                const isActive = section === item.section;
                                return (
                                    <button
                                        key={item.name}
                                        type="button"
                                        onClick={() => handleSectionChange(item.section)}
                                        className={`
                      w-full text-left group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors
                      ${
                          isActive
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                      }
                    `}
                                    >
                                        <item.icon
                                            className={`
                        mr-3 flex-shrink-0 h-6 w-6 transition-colors
                        ${
                            isActive
                                ? 'text-blue-700 dark:text-blue-400'
                                : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                        }
                      `}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-800 p-4">
                            <button
                                onClick={() => logout()}
                                className="flex-shrink-0 w-full group block bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl transition-colors font-medium text-sm text-center"
                            >
                                Deconnexion
                            </button>
                        </div>
                    </div>
                </div>

                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
                    <Suspense fallback={<div className="flex items-center justify-center h-64 text-sm text-gray-500">Chargement...</div>}>
                        {currentSection}
                    </Suspense>
                </main>

                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}
            </div>
        </AdminSectionContext.Provider>
    );
}
