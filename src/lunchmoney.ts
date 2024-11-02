import LunchMoney from "lunch-money";
import { getPreferences } from "./preferences";

export const getLunchMoney = () => {
  const { token } = getPreferences();

  return new LunchMoney({ token });
};
