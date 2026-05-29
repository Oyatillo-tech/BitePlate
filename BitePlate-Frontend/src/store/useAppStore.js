import { create } from 'zustand';

export const useAppStore = create((set) => ({
    // Auth
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    setUser: (user) => {
        set({ user });
        if (user) localStorage.setItem('user', JSON.stringify(user));
    },

    // Tables
    tables: [],
    setTables: (tables) => set({ tables }),
    selectedTable: null,
    setSelectedTable: (table) => set({ selectedTable: table }),

    // Menu
    menu: [],
    setMenu: (menu) => set({ menu }),

    // Cart
    cartItems: [],
    addToCart: (item) => set((state) => ({
        cartItems: [...state.cartItems, { ...item, cartId: Date.now() }]
    })),
    removeFromCart: (cartId) => set((state) => ({
        cartItems: state.cartItems.filter(item => item.cartId !== cartId)
    })),
    updateCartItem: (cartId, quantity) => set((state) => ({
        cartItems: state.cartItems.map(item =>
            item.cartId === cartId ? { ...item, quantity } : item
        )
    })),
    clearCart: () => set({ cartItems: [] }),
    getCartTotal: () => {
        const state = useAppStore.getState();
        return state.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    // Current Order
    currentOrder: null,
    setCurrentOrder: (order) => set({ currentOrder: order }),

    // Billing
    bills: [],
    setBills: (bills) => set({ bills }),

    // Orders
    orders: [],
    setOrders: (orders) => set({ orders }),

    // Analytics
    analytics: null,
    setAnalytics: (analytics) => set({ analytics }),

    // UI
    loading: false,
    setLoading: (loading) => set({ loading }),
    error: null,
    setError: (error) => set({ error }),
    success: null,
    setSuccess: (success) => set({ success }),

    // Notifications
    notifications: [],
    addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, { ...notification, id: Date.now() }]
    })),
    removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
    })),
}));