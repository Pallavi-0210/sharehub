import React, { createContext, useState, useContext } from 'react';

const INITIAL_ITEMS = [
    {
        id: "1",
        name: "Engineering Maths",
        price: "₹250",
        type: "Sell",
        condition: "Good",
        category: "Books",
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600",
        owner: "Amit",
        location: "Hostel A"
    },
    {
        id: "2",
        name: "Scientific Calculator",
        price: "Free",
        type: "Share",
        condition: "New",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=600",
        owner: "Riya",
        location: "Central Library"
    },
    {
        id: "3",
        name: "Laptop Stand",
        price: "₹600",
        type: "Sell",
        condition: "Used",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600",
        owner: "Karan",
        location: "Hostel B"
    },
    {
        id: "4",
        name: "Drawing Board",
        price: "₹300",
        type: "Sell",
        condition: "Good",
        category: "Lab Gear",
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600",
        owner: "Sania",
        location: "Design Studio"
    },
    {
        id: "5",
        name: "Study Lamp",
        price: "Free",
        type: "Share",
        condition: "Good",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=600",
        owner: "Rahul",
        location: "Hostel C"
    },
    {
        id: "6",
        name: "Lab Coat (XL)",
        price: "₹150",
        type: "Sell",
        condition: "Used",
        category: "Lab Gear",
        image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=600",
        owner: "Sneha",
        location: "Chemistry Block"
    },
    {
        id: "7",
        name: "Ergonomic Chair",
        price: "₹1200",
        type: "Sell",
        condition: "New",
        category: "Furniture",
        image: "https://images.unsplash.com/photo-1505797149-43b0ad766207?q=80&w=600",
        owner: "Vikram",
        location: "Hostel A"
    }
];

interface ItemsContextType {
    items: any[];
    addItem: (newItem: any) => void;
}

const ItemsContext = createContext<ItemsContextType | null>(null);

export const ItemsProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState(INITIAL_ITEMS);

    const addItem = (newItem: any) => {
        setItems((prev) => [newItem, ...prev]);
    };

    return (
        <ItemsContext.Provider value={{ items, addItem }}>
            {children}
        </ItemsContext.Provider>
    );
};

export const useItems = () => {
    const context = useContext(ItemsContext);
    if (!context) {
        throw new Error("useItems must be used within an ItemsProvider.");
    }
    return context;
};

export default function ContextProviderComponent() {
    return null;
}