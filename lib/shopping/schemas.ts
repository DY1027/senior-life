import { z } from "zod";

export const practiceImageSchema = z.object({
  src: z.string().startsWith("/"),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  kind: z.enum(["product-photoreal", "mission-lifestyle", "state-object", "ui-icon"]),
  background: z.enum(["white", "light-gray", "lifestyle"]).optional(),
  angle: z.enum(["front", "three-quarter", "top-down"]).optional(),
  generationPromptId: z.string().optional(),
});

export const practiceProductSchema = z.object({
  id: z.string().min(1),
  categoryId: z.string().min(1),
  title: z.string().min(1),
  shortLabel: z.string().min(1),
  description: z.string().min(1),
  examplePrice: z.number().int().nonnegative(),
  shippingFee: z.number().int().nonnegative(),
  bundleQuantity: z.number().int().positive(),
  image: practiceImageSchema,
  features: z.record(z.string(), z.string()),
  badges: z.array(z.string()).default([]),
  isPracticeOnly: z.literal(true),
  disclosure: z.literal("연습용 예시 상품"),
});

export const shoppingMissionSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  shortTitle: z.string().min(1),
  summary: z.string().min(1),
  mode: z.enum(["guided", "budget", "compare", "mistake"]),
  difficulty: z.enum(["처음", "쉬움", "보통"]),
  estimatedMinutes: z.number().int().positive(),
  accent: z.enum(["blue", "violet", "green", "coral"]),
  visual: z.object({
    cardImage: practiceImageSchema,
    heroImage: practiceImageSchema.optional(),
  }),
  productIds: z.array(z.string()).min(1),
  steps: z.array(z.string()).min(1),
  budget: z.number().int().positive().optional(),
  requiredCategoryIds: z.array(z.string()).optional(),
  correctProductId: z.string().optional(),
  requiredMistakeIds: z.array(z.string()).optional(),
  learningPoints: z.array(z.string()).min(1),
  collectionSlug: z.string().min(1),
});

export type PracticeImageAsset = z.infer<typeof practiceImageSchema>;
export type PracticeProduct = z.infer<typeof practiceProductSchema>;
export type ShoppingMission = z.infer<typeof shoppingMissionSchema>;

