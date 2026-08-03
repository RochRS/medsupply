import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  itemId: number;
  itemName: string;
  remainingAmount: number;
  amount: number;
};

type CartContextValue = {
  items: CartItem[];
  totalCount: number;
  addItem: (item: Omit<CartItem, "amount">, amount?: number) => void;
  updateAmount: (itemId: number, amount: number) => void;
  removeItem: (itemId: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "medsupply-cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() =>
    typeof window === "undefined" ? [] : loadCart(),
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (item: Omit<CartItem, "amount">, amount = 1) => {
      const qty = Math.max(1, Math.floor(amount));
      setItems((prev) => {
        const existing = prev.find((row) => row.itemId === item.itemId);
        if (existing) {
          return prev.map((row) =>
            row.itemId === item.itemId
              ? { ...row, amount: row.amount + qty }
              : row,
          );
        }
        return [...prev, { ...item, amount: qty }];
      });
    };

    const updateAmount = (itemId: number, amount: number) => {
      const qty = Math.max(1, Math.floor(amount));
      setItems((prev) =>
        prev.map((row) => (row.itemId === itemId ? { ...row, amount: qty } : row)),
      );
    };

    const removeItem = (itemId: number) => {
      setItems((prev) => prev.filter((row) => row.itemId !== itemId));
    };

    const clear = () => setItems([]);

    return {
      items,
      totalCount: items.reduce((sum, row) => sum + row.amount, 0),
      addItem,
      updateAmount,
      removeItem,
      clear,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
