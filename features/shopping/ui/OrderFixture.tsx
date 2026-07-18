"use client";

import { useEffect } from "react";
import type { OrderState } from "@/features/shopping/domain/types";
import { createOrderFixture } from "@/features/shopping/storage/shopping-storage";
import OrderDetail from "@/features/shopping/ui/OrderDetail";

type FixtureState = Extract<OrderState, "PAID" | "SHIPPED" | "DELIVERED">;

export default function OrderFixture({ state }: { state: FixtureState }) {
  const orderId = `fixture-${state.toLowerCase()}`;
  useEffect(() => {
    createOrderFixture(state);
  }, [state]);
  return <OrderDetail orderId={orderId} />;
}
