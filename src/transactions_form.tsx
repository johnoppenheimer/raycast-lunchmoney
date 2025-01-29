// Add this new component
import { Action, ActionPanel, Form, Icon, Toast, showToast, useNavigation } from "@raycast/api";
import { useCachedPromise, useForm } from "@raycast/utils";
import * as lunchMoney from "./lunchmoney";

export function EditTransactionForm({
    transaction,
    onUpdate,
}: {
    transaction: lunchMoney.Transaction;
    onUpdate: () => void;
}) {
    const { pop } = useNavigation();
    const { data: categories, isLoading } = useCachedPromise(lunchMoney.getCategories, []);
    const { handleSubmit, itemProps } = useForm<{
        payee: string;
        category_id: string;
        reviewed: boolean;
        amount: string;
    }>({
        onSubmit: async (values) => {
            const toast = await showToast({
                style: Toast.Style.Animated,
                title: "Updating transaction...",
            });

            try {
                await lunchMoney.updateTransaction(transaction.id, {
                    payee: values.payee,
                    category_id: values.category_id ? parseInt(values.category_id) : undefined,
                });

                toast.style = Toast.Style.Success;
                toast.title = "Transaction updated";

                // onUpdate(); // XXX: do we have to update cached tx ?

                pop();
            } catch (error) {
                toast.style = Toast.Style.Failure;
                toast.title = "Failed to update transaction";
                if (error instanceof Error) {
                    toast.message = error.message;
                }
            }
        },
        validation: {
            payee: (value) => {
                if (!value?.length) return "Payee is required";
            },
        },
        initialValues: {
            payee: transaction.payee,
            category_id: transaction.category_id?.toString() ?? "",
            reviewed: transaction.status == lunchMoney.TransactionStatus.CLEARED,
            amount: transaction.amount,
        },
    });

    const renderCategories = (categories?: lunchMoney.Category[]) => {
        if (!categories) return null;

        return categories.map((category) => {
            if (category.is_group && category.children) {
                return (
                    <Form.Dropdown.Section key={category.id} title={category.name}>
                        {category.children.map((child) => (
                            <Form.Dropdown.Item
                                key={child.id}
                                value={String(child.id)}
                                title={child.name}
                                icon={category.id === transaction.category_id ? Icon.Check : undefined}
                            />
                        ))}
                    </Form.Dropdown.Section>
                );
            }

            return (
                <Form.Dropdown.Item
                    key={category.id}
                    value={String(category.id)}
                    title={category.name}
                    icon={category.id === transaction.category_id ? Icon.Check : undefined}
                />
            );
        });
    };

    return (
        <Form
            isLoading={isLoading}
            actions={
                <ActionPanel>
                    <Action.SubmitForm title="Save Changes" onSubmit={handleSubmit} />
                    <Action title="Back" shortcut={{ modifiers: [], key: "arrowLeft" }} onAction={pop} />
                </ActionPanel>
            }
        >
            <Form.Description title={`Transaction`} text={transaction.date} />
            <Form.TextField title="Payee" placeholder="Transaction payee" {...itemProps.payee} />
            <Form.TextField title="Amount" placeholder="Transaction amount" {...itemProps.amount} />
            <Form.Dropdown title="Category" {...itemProps.category_id}>
                <Form.Dropdown.Item title="No Category" value="" icon={Icon.XMarkCircle} />
                {renderCategories(categories)}
            </Form.Dropdown>
            <Form.Checkbox title="Status" label="Reviewed" {...itemProps.reviewed} />
        </Form>
    );
}
