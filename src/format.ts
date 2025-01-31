import { match, P } from "ts-pattern";
import * as lunchMoney from "./lunchmoney";
import { Icon, Color, Image } from "@raycast/api";

export const getFormatedAmount = (transaction: lunchMoney.Transaction): string =>
    `${Intl.NumberFormat("en-US", { style: "currency", currency: transaction.currency }).format(transaction.to_base)}`
