import { getPreferenceValues } from "@raycast/api";

export type LunchMoneyPreferences = {
  token: string;
  maxMonthsTransactionsHistory: number;
};

export const getPreferences = getPreferenceValues<LunchMoneyPreferences>;
