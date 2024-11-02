import { ActionPanel, List, Action, Icon, Color, Image, showToast, Toast } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { match, P } from "ts-pattern";
import * as lunchMoney from "./lunchmoney";
import { useMemo } from "react";
import { compareAsc } from "date-fns/compareAsc";
import { format } from "date-fns";
import { sift } from "radash";

const getTransactionIcon = (transaction: lunchMoney.Transaction) =>
  match(transaction)
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

const getTransactionSubtitle = (transaction: lunchMoney.Transaction) =>
  match(transaction)
    .returnType<string>()
    .with(
      { recurring_payee: P.string.select(), recurring_type: lunchMoney.ReccuringTransactionType.CLEARED },
      (payee) => payee,
    )
    .otherwise(() => transaction.payee);

function TransactionListItem({ transaction }: { transaction: lunchMoney.Transaction }) {
  const validate = async () => {
    const toast = await showToast({
      title: "Validating",
      style: Toast.Style.Animated,
    });

    try {
      await lunchMoney.updateTransaction(transaction.id, {
        status: lunchMoney.TransactionStatus.CLEARED,
      });

      toast.style = Toast.Style.Success;
      toast.title = "Validated";
    } catch (error) {
      toast.style = Toast.Style.Failure;
      toast.title = "Failed to validate";
      if (error instanceof Error) {
        toast.message = error.message;
      }
    }
  };

  return (
    <List.Item
      title={`${Intl.NumberFormat("en-US", { style: "currency", currency: transaction.currency }).format(transaction.to_base)}`}
      subtitle={getTransactionSubtitle(transaction)}
      icon={getTransactionIcon(transaction)}
      accessories={[
        { text: `${transaction.plaid_account_name ?? transaction.asset_name ?? ""}` },
        { date: new Date(transaction.created_at), tooltip: format(transaction.created_at, "PPPppp") },
      ]}
      keywords={sift([transaction.payee, transaction.recurring_payee, transaction.notes, transaction.display_note])}
      actions={
        <ActionPanel>
          {transaction.status != lunchMoney.TransactionStatus.CLEARED && !transaction.is_pending && (
            <Action title="Validate" onAction={validate} />
          )}
          <Action.OpenInBrowser
            title="View Payee in Lunch Money"
            url={`https://my.lunchmoney.app/transactions/${format(transaction.date, "yyyy/MM")}?match=all&payee_exact=${encodeURIComponent(transaction.payee)}&time=month`}
          />
        </ActionPanel>
      }
    />
  );
}

export default function Command() {
  const { data, isLoading } = useCachedPromise(lunchMoney.getTransactions);

  const [pendingTransactions, transactions] = useMemo(() => {
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

    return [
      pendingTransactions.sort((a, b) => compareAsc(b.created_at, a.created_at)),
      transactions.sort((a, b) => compareAsc(b.created_at, a.created_at)),
    ];
  }, [data?.map((t) => t.id).join(",")]);

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
