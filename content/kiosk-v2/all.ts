import { atmCatalog, atmScenarios } from "./atm";
import { burgerCatalog, burgerScenarios } from "./burger";
import { cafeCatalog, cafeScenarios } from "./cafe";
import { civilCatalog, civilScenarios } from "./civil";
import { martCatalog, martScenarios } from "./mart";
import { parkingCatalog, parkingScenarios } from "./parking";
import { ticketCatalog, ticketScenarios } from "./ticket";

export const allKioskBundles = [
  { catalog: cafeCatalog, scenarios: cafeScenarios },
  { catalog: burgerCatalog, scenarios: burgerScenarios },
  { catalog: ticketCatalog, scenarios: ticketScenarios },
  { catalog: parkingCatalog, scenarios: parkingScenarios },
  { catalog: martCatalog, scenarios: martScenarios },
  { catalog: atmCatalog, scenarios: atmScenarios },
  { catalog: civilCatalog, scenarios: civilScenarios },
] as const;
