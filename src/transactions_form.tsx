// Add this new component
import { Action, ActionPanel, Form, Icon, Toast, showToast, useNavigation } from "@raycast/api";
import { useCachedPromise, useForm } from "@raycast/utils";
import * as lunchMoney from "./lunchmoney";
import { Key, useMemo, useState } from "react";

export function EditTransactionForm({
    transaction,
    onEdit,
}: {
    transaction: lunchMoney.Transaction;
    onEdit: (transaction: lunchMoney.Transaction, update: lunchMoney.TransactionUpdate) => void;
}) {
    const { pop } = useNavigation();
    const { data: categories, isLoading: isLoadingCategories } = useCachedPromise(lunchMoney.getCategories, []);
    const { data: tags, isLoading: isLoadingTags } = useCachedPromise(lunchMoney.getTags, []);

    const [searchText, setSearchText] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>(
        transaction.tags?.map(tag => String(tag.id)) || []
    );

    const { handleSubmit, itemProps } = useForm<{
        payee: string;
        category_id: string;
        reviewed: boolean;
        amount: string;
        notes: string;
    }>({
        onSubmit: async (values) => {
            const toast = await showToast({
                style: Toast.Style.Animated,
                title: "Updating transaction...",
            });

            const tagsToUpdate = selectedTags.map((tag: string) => {
                console.log(tag)
                const id = parseInt(tag, 10);
                return isNaN(id) ? tag : id;
            });

            const update: lunchMoney.TransactionUpdate = {
                payee: values.payee,
                category_id: values.category_id ? parseInt(values.category_id) : undefined,
                tags: tagsToUpdate,
                status: values.reviewed ? lunchMoney.TransactionStatus.CLEARED : lunchMoney.TransactionStatus.UNCLEARED,
                notes: values.notes,
            }

            onEdit(transaction, update);
            pop();
        },
        validation: {
            payee: (value) => {
                if (!value?.length) return "Payee is required";
            },
        },
        initialValues: {
            payee: transaction.payee,
            category_id: transaction.category_id?.toString() ?? "",
            amount: transaction.amount,
            notes: transaction.notes,
            // We can assume that if the user is editing and updating the
            // transaction, it is considered reviewed until the user manually
            // unchecks the box.
            reviewed: true,
        },
    });

    const tagItems = useMemo(() => {
        if (!tags) return [];
        const filteredTags = tags.filter((tag: { name: string; }) =>
            tag.name.toLowerCase().includes(searchText.toLowerCase())
        );
        const items = filteredTags.map((tag: { id: Key | null | undefined; name: string; }) => (
            <Form.TagPicker.Item key={tag.id} value={String(tag.id)} title={tag.name} />
        ));
        if (searchText && !tags.some((tag: { name: any; }) => tag.name === searchText)) {
            items.push(
                <Form.TagPicker.Item
                    key="create"
                    value={searchText}
                    title={`Create "${searchText}"`}
                />
            );
        }
        return items;
    }, [tags, searchText]);

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

    const formatedAmount = `${Intl.NumberFormat("en-US", { style: "currency", currency: transaction.currency }).format(transaction.to_base)}}`

    return (
        <Form
            isLoading={isLoadingCategories || isLoadingTags}
            actions={
                <ActionPanel>
                    <Action.SubmitForm title="Save Changes" onSubmit={handleSubmit} />
                    <Action title="Back" shortcut={{ modifiers: [], key: "arrowLeft" }} onAction={pop} f />
                </ActionPanel>
            }
        >
            <Form.TextField title="Payee" placeholder="Transaction payee" {...itemProps.payee} />
            <Form.Dropdown title="Category" {...itemProps.category_id}>
                <Form.Dropdown.Item title="No Category" value="" icon={Icon.XMarkCircle} />
                {renderCategories(categories)}
            </Form.Dropdown>
            <Form.TagPicker
                id="tags"
                title="Tags"
                value={selectedTags}
                onChange={setSelectedTags}
            >
                {tagItems}
            </Form.TagPicker>
            <Form.TextArea title="Notes" {...itemProps.notes} />
            <Form.Checkbox title="Status" label="Reviewed" {...itemProps.reviewed} />

            <Form.Separator />

            {transaction.display_name &&
                <Form.Description title={`Name`} text={transaction.display_name} />}
            <Form.Description title={`Date`} text={transaction.date} />
            {transaction.plaid_account_name &&
                <Form.Description title={`Account`} text={transaction.plaid_account_name} />}
            <Form.Description title={`Amount`} text={formatedAmount} />
        </Form>
    );
}
