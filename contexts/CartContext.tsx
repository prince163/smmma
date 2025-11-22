'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
    packageId: string;
    packageName: string;
    serviceName: string;
    platformName: string;
    platformIcon: string;
    quantity: number;
    price: number;
    link: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'link'>) => void;
    removeFromCart: (packageId: string) => void;
    updateLink: (packageId: string, link: string) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('smm_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('smm_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: Omit<CartItem, 'link'>) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.packageId === item.packageId);
            if (existing) {
                return prev; // Already in cart
            }
            return [...prev, { ...item, link: '' }];
        });
    };

    const removeFromCart = (packageId: string) => {
        setCart((prev) => prev.filter((item) => item.packageId !== packageId));
    };

    const updateLink = (packageId: string, link: string) => {
        setCart((prev) =>
            prev.map((item) =>
                item.packageId === packageId ? { ...item, link } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price, 0);
    };

    const getItemCount = () => {
        return cart.length;
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateLink,
                clearCart,
                getTotalPrice,
                getItemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
