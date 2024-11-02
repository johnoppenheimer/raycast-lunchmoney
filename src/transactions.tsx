import { ActionPanel, List, Action, Icon, Color, Image } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { match, P } from "ts-pattern";
import * as lunchMoney from "./lunchmoney";

function getTransactionIcon(transaction: lunchMoney.Transaction) {
  return match(transaction)
    .returnType<Image>()
    .with({ status: lunchMoney.TransactionStatus.CLEARED, recurring_type: P.nullish }, () => ({
      source: Icon.CheckCircle,
      tintColor: Color.Green,
    }))
    .with(
      { status: lunchMoney.TransactionStatus.CLEARED, recurring_type: lunchMoney.ReccuringTransactionType.CLEARED },
      () => ({
        source: Icon.Repeat,
        tintColor: Color.Blue,
      }),
    )
    .with({ status: lunchMoney.TransactionStatus.UNCLEARED }, () => ({
      source: Icon.CircleProgress50,
      tintColor: Color.Yellow,
    }))
    .with({ status: lunchMoney.TransactionStatus.PENDING }, () => ({
      source: Icon.Stopwatch,
    }))
    .otherwise(() => ({ source: Icon.Circle }));
}

function TransactionListItem({ transaction }: { transaction: lunchMoney.Transaction }) {
  return (
    <List.Item
      title={`${Intl.NumberFormat("en-US", { style: "currency", currency: transaction.currency }).format(transaction.to_base)}`}
      subtitle={transaction.payee}
      icon={getTransactionIcon(transaction)}
      accessories={[
        { text: `${transaction.plaid_account_name ?? transaction.asset_name ?? ""}` },
        { date: new Date(transaction.date), tooltip: transaction.date },
      ]}
      actions={
        <ActionPanel>
          {transaction.status != lunchMoney.TransactionStatus.CLEARED && (
            <Action title="Validate" onAction={() => console.log("validate transaction")} />
          )}
        </ActionPanel>
      }
    />
  );
}

export default function Command() {
  const { data, isLoading } = usePromise(lunchMoney.getTransactions);

  const [pendingTransactions, transactions] = (data ?? []).reduce(
    function groupTransactions(acc, transaction) {
      if (transaction.status === lunchMoney.TransactionStatus.PENDING) {
        acc[0].push(transaction);
      } else {
        acc[1].push(transaction);
      }
      return acc;
    },
    [[], []] as [lunchMoney.Transaction[], lunchMoney.Transaction[]],
  );

  return (
    <List isLoading={isLoading}>
      <List.Section title="Pending Transactions">
        {pendingTransactions.map((transaction) => (
          <TransactionListItem key={String(transaction.id)} transaction={transaction} />
        ))}
      </List.Section>
      <List.Section title="Transactions">
        {transactions.map((transaction) => (
          <TransactionListItem key={String(transaction.id)} transaction={transaction} />
        ))}
      </List.Section>
    </List>
  );
}
