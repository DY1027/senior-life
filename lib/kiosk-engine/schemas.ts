// 시나리오·카탈로그 Zod 검증 (기술 명세서 5.2).
// 모든 데이터는 화면에 쓰이기 전에 validateCatalog/validateScenario를 통과해야 한다.
// 데이터 실수(없는 상품, 없는 옵션, 0 이하 수량)는 빌드·개발 단계에서 잡는 게 목적.
import { z } from "zod";
import type { Catalog, Scenario } from "./types";

const optionChoiceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  priceDelta: z.number().int().optional(),
});

const optionGroupSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  choices: z.array(optionChoiceSchema).min(1),
  required: z.boolean().optional(),
  defaultChoiceId: z.string().optional(),
});

const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  emoji: z.string().min(1),
  price: z.number().int().nonnegative(),
  categoryId: z.string().min(1),
  optionGroupIds: z.array(z.string()).optional(),
});

export const catalogSchema = z.object({
  kioskType: z.string().min(1),
  brand: z.string().min(1),
  emoji: z.string().min(1),
  place: z.string().min(1),
  serviceTypes: z.array(z.object({ id: z.string(), label: z.string(), emoji: z.string() })).min(1),
  categories: z.array(z.object({ id: z.string(), label: z.string() })).min(1),
  products: z.array(productSchema).min(1),
  optionGroups: z.array(optionGroupSchema),
  paymentMethods: z.array(z.object({ id: z.string(), label: z.string(), emoji: z.string(), hint: z.string().optional() })).min(1),
  unitLabel: z.string().min(1),
});

const missionItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  options: z.record(z.string(), z.string()).optional(),
});

export const scenarioSchema = z.object({
  id: z.string().min(1),
  kioskType: z.string().min(1),
  title: z.string().min(1),
  mode: z.enum(["learn", "solo", "challenge", "free"]),
  missionText: z.string().min(1).optional(),
  mission: z
    .object({
      serviceType: z.string().optional(),
      items: z.array(missionItemSchema).min(1),
      paymentMethod: z.string().optional(),
      receipt: z.boolean().optional(),
    })
    .optional(),
  preloadCart: z.array(missionItemSchema).optional(),
  events: z.array(z.enum(["cardFailOnce", "soldOutDecoy"])).optional(),
  layout: z.enum(["top", "left"]).optional(),
});

/** 카탈로그 형식 + 내부 참조(카테고리·옵션 그룹) 검증. 실패 시 이유를 던진다. */
export function validateCatalog(raw: unknown): Catalog {
  const cat = catalogSchema.parse(raw) as Catalog;
  const categoryIds = new Set(cat.categories.map((c) => c.id));
  const groupIds = new Set(cat.optionGroups.map((g) => g.id));
  for (const p of cat.products) {
    if (!categoryIds.has(p.categoryId)) throw new Error(`[catalog:${cat.kioskType}] 상품 ${p.id}의 카테고리 ${p.categoryId} 없음`);
    for (const g of p.optionGroupIds ?? []) {
      if (!groupIds.has(g)) throw new Error(`[catalog:${cat.kioskType}] 상품 ${p.id}의 옵션 그룹 ${g} 없음`);
    }
  }
  return cat;
}

/** 시나리오 형식 + 카탈로그 대조(존재하는 상품·옵션·결제수단인지) 검증 */
export function validateScenario(raw: unknown, catalog: Catalog): Scenario {
  const sc = scenarioSchema.parse(raw) as Scenario;
  if (sc.kioskType !== catalog.kioskType) throw new Error(`[scenario:${sc.id}] kioskType 불일치`);
  if (sc.mode !== "free" && (!sc.mission || !sc.missionText)) {
    throw new Error(`[scenario:${sc.id}] free 모드가 아니면 mission과 missionText가 필요`);
  }
  const productById = new Map(catalog.products.map((p) => [p.id, p]));
  const groupById = new Map(catalog.optionGroups.map((g) => [g.id, g]));
  const checkItems = (items: { productId: string; options?: Record<string, string> }[], where: string) => {
    for (const item of items) {
      const p = productById.get(item.productId);
      if (!p) throw new Error(`[scenario:${sc.id}] ${where}의 상품 ${item.productId} 없음`);
      for (const [gid, cid] of Object.entries(item.options ?? {})) {
        if (!(p.optionGroupIds ?? []).includes(gid)) throw new Error(`[scenario:${sc.id}] 상품 ${p.id}에 없는 옵션 그룹 ${gid}`);
        const g = groupById.get(gid);
        if (!g?.choices.some((c) => c.id === cid)) throw new Error(`[scenario:${sc.id}] 옵션 ${gid}에 없는 선택지 ${cid}`);
      }
    }
  };
  if (sc.mission) {
    checkItems(sc.mission.items, "mission");
    if (sc.mission.serviceType && !catalog.serviceTypes.some((s) => s.id === sc.mission!.serviceType)) {
      throw new Error(`[scenario:${sc.id}] 없는 serviceType ${sc.mission.serviceType}`);
    }
    if (sc.mission.paymentMethod && !catalog.paymentMethods.some((m) => m.id === sc.mission!.paymentMethod)) {
      throw new Error(`[scenario:${sc.id}] 없는 결제수단 ${sc.mission.paymentMethod}`);
    }
  }
  if (sc.preloadCart) checkItems(sc.preloadCart, "preloadCart");
  return sc;
}
