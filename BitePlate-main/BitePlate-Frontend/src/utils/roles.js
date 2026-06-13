export const ROLE_ACCESS = {
    MANAGER: ['dashboard', 'tables', 'menu', 'orders', 'kitchen', 'billing', 'analytics', 'reservations'],
    WAITER: ['dashboard', 'tables', 'menu', 'orders', 'reservations'],
    CHEF: ['dashboard', 'kitchen'],
    CASHIER: ['dashboard', 'billing', 'analytics'],
};

export const ROUTE_ROLES = {
    '/dashboard': ['MANAGER', 'WAITER', 'CHEF', 'CASHIER'],
    '/tables': ['MANAGER', 'WAITER'],
    '/menu': ['MANAGER', 'WAITER'],
    '/orders': ['MANAGER', 'WAITER'],
    '/kitchen': ['MANAGER', 'CHEF'],
    '/billing': ['MANAGER', 'CASHIER'],
    '/analytics': ['MANAGER', 'CASHIER'],
    '/reservations': ['MANAGER', 'WAITER'],
};

export const NAV_ITEMS = [
    { label: 'Dashboard', path: '/dashboard', roles: ['MANAGER', 'WAITER', 'CHEF', 'CASHIER'] },
    { label: 'Tables', path: '/tables', roles: ['MANAGER', 'WAITER'] },
    { label: 'Menu', path: '/menu', roles: ['MANAGER', 'WAITER'] },
    { label: 'Orders', path: '/orders', roles: ['MANAGER', 'WAITER'] },
    { label: 'Kitchen', path: '/kitchen', roles: ['MANAGER', 'CHEF'] },
    { label: 'Billing', path: '/billing', roles: ['MANAGER', 'CASHIER'] },
    { label: 'Analytics', path: '/analytics', roles: ['MANAGER', 'CASHIER'] },
    { label: 'Reservations', path: '/reservations', roles: ['MANAGER', 'WAITER'] },
];

export function canAccessRoute(role, path) {
    const allowed = ROUTE_ROLES[path];
    return allowed ? allowed.includes(role) : true;
}

export function getNavItemsForRole(role) {
    return NAV_ITEMS.filter(item => item.roles.includes(role));
}
