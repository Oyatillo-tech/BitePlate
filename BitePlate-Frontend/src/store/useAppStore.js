import { create } from 'zustand';

export const useAppStore = create((set) => ({
    // Tables state
    tables: [],
    setTables: (tables) => set({ tables }),

    // Menu state
    menu: [],
    setMenu: (menu) => set({ menu }),

    // Current order
    currentOrder: null,
    setCurrentOrder: (order) => set({ currentOrder: order }),

    // Current table
    currentTable: null,
    setCurrentTable: (table) => set({ currentTable: table }),

    // Cart items
    cartItems: [],
    addToCart: (item) => set((state) => ({
        cartItems: [...state.cartItems, { ...item, cartId: Date.now() }]
    })),
    removeFromCart: (cartId) => set((state) => ({
        cartItems: state.cartItems.filter(item => item.cartId !== cartId)
    })),
    clearCart: () => set({ cartItems: [] }),

    // Bills
    bills: [],
    setBills: (bills) => set({ bills }),

    // Orders history
    orderHistory: [],
    setOrderHistory: (history) => set({ orderHistory: history }),
}));