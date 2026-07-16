import "server-only";

import { atmScenarios } from "@/content/kiosk-v2/atm";
import { burgerScenarios } from "@/content/kiosk-v2/burger";
import { cafeScenarios } from "@/content/kiosk-v2/cafe";
import { civilScenarios } from "@/content/kiosk-v2/civil";
import { martScenarios } from "@/content/kiosk-v2/mart";
import { parkingScenarios } from "@/content/kiosk-v2/parking";
import { ticketScenarios } from "@/content/kiosk-v2/ticket";
import type { KioskId } from "@/lib/kiosk-config";
import type { Scenario } from "@/lib/kiosk-engine/types";

export type DailyMission = {
  id: string;
  kioskType: KioskId;
  scenarioId: string;
  title: string;
  description: string;
};

type DailyMissionRef = Pick<DailyMission, "kioskType" | "scenarioId">;

const SCENARIOS_BY_KIOSK = {
  cafe: cafeScenarios,
  fastfood: burgerScenarios,
  ticket: ticketScenarios,
  parking: parkingScenarios,
  mart: martScenarios,
  atm: atmScenarios,
  civil: civilScenarios,
} satisfies Record<KioskId, Scenario[]>;

const FALLBACK_REF = { kioskType: "cafe", scenarioId: "cafe-learn-americano" } as const;

const DAILY_MISSION_REFS: DailyMissionRef[] = [
  FALLBACK_REF,
  { kioskType: "fastfood", scenarioId: "burger-solo-change-drink" },
  { kioskType: "parking", scenarioId: "parking-learn-card" },
  { kioskType: "civil", scenarioId: "civil-learn-deungbon" },
  { kioskType: "cafe", scenarioId: "cafe-solo-two-ice" },
  { kioskType: "parking", scenarioId: "parking-solo-discount" },
  { kioskType: "civil", scenarioId: "civil-learn-family" },
  { kioskType: "fastfood", scenarioId: "burger-learn-set" },
  { kioskType: "mart", scenarioId: "mart-learn-two-items" },
  { kioskType: "mart", scenarioId: "mart-solo-double-scan" },
  { kioskType: "ticket", scenarioId: "ticket-learn-daejeon" },
  { kioskType: "ticket", scenarioId: "ticket-challenge-soldout" },
  { kioskType: "atm", scenarioId: "atm-learn-withdraw" },
  { kioskType: "atm", scenarioId: "atm-solo-receipt" },
];

function findScenario(ref: DailyMissionRef): Scenario | undefined {
  return SCENARIOS_BY_KIOSK[ref.kioskType].find((scenario) => scenario.id === ref.scenarioId);
}

function fallbackScenario(): Scenario {
  const scenario = findScenario(FALLBACK_REF);
  if (!scenario) throw new Error("[daily-missions] 기본 임무 시나리오가 없습니다.");
  return scenario;
}

function resolveDailyMission(ref: DailyMissionRef): DailyMission {
  const found = findScenario(ref);
  const scenario = found ?? fallbackScenario();
  const kioskType = found ? ref.kioskType : FALLBACK_REF.kioskType;

  if (!found) {
    console.error(`[daily-missions] '${ref.kioskType}/${ref.scenarioId}'가 없어 기본 임무로 대체합니다.`);
  }

  return {
    id: `${kioskType}-${scenario.id}`,
    kioskType,
    scenarioId: scenario.id,
    title: scenario.title,
    description: scenario.missionText ?? scenario.title,
  };
}

const DAILY_MISSIONS = DAILY_MISSION_REFS.map(resolveDailyMission);

/** 날짜 기준으로 실제 존재하는 시나리오 하나를 고른다. */
export function todayMission(date = new Date()): DailyMission {
  const dayNumber = Math.floor(date.getTime() / 86400000);
  const index = ((dayNumber % DAILY_MISSIONS.length) + DAILY_MISSIONS.length) % DAILY_MISSIONS.length;
  return DAILY_MISSIONS[index];
}

export function dailyMissionUrl(mission: DailyMission): string {
  return `/kiosk/${mission.kioskType}/${mission.scenarioId}`;
}
