"use client";

import { useCallback, useEffect, useState } from "react";
import type { CartSnapshot, OrdersSnapshot } from "@/features/shopping/domain/types";
import { readCart, readOrders, SHOPPING_STORAGE_EVENT } from "@/features/shopping/storage/shopping-storage";

export function useShoppingCart() {
  const [cart, setCart] = useState<CartSnapshot>({ version: 2, lines: [] });
  const refresh = useCallback(() => setCart(readCart()), []);

  useEffect(() => {
    const timer = window.setTimeout(refresh, 0);
    window.addEventListener(SHOPPING_STORAGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(SHOPPING_STORAGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  return cart;
}

export function useShoppingOrders() {
  const [orders, setOrders] = useState<OrdersSnapshot>({ version: 2, orders: [] });
  const refresh = useCallback(() => setOrders(readOrders()), []);

  useEffect(() => {
    const timer = window.setTimeout(refresh, 0);
    window.addEventListener(SHOPPING_STORAGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(SHOPPING_STORAGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  return orders;
}
