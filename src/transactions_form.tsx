// Add this new component
import { Action, ActionPanel, Form, Icon, useNavigation } from "@raycast/api";
import { useCachedPromise, useForm } from "@raycast/utils";
import * as lunchMoney from "./lunchmoney";
import { Key, useMemo, useState } from "react";
import { getFormatedAmount } from "./format";

export function EditTransactionForm({
  transaction,
  onEdit,
}: {
  transaction: lunchMoney.Transaction;
  onEdit: (transaction: lunchMoney.Transaction, update: lunchMoney.TransactionUpdate) => void;
}) {
  const { pop } = useNavigation();
  const { data: categories, isLoading: isLoadingCategories } = useCachedPromise(lunchMoney.getCategories, []);
  const { data: recuringItems, isLoading: isLoadingRecuringItems } = useCachedPromise(lunchMoney.getRecurringItems, []);
  const { data: tags, isLoading: isLoadingTags } = useCachedPromise(lunchMoney.getTags, []);
  const [newTags, setNewTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(transaction.tags?.map((tag) => String(tag.id)) || []);
  const [date, setDate] = useState<Date | null>(new Date(transaction.date));
  const formattedDate = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const { handleSubmit, itemProps } = useForm<{
    payee: string;
    category_id: string;
    recuring_id: string;
    reviewed: boolean; // XXX: should handle 3 states (+PENDING) and toggle 2 states (CLEARED/UNCLEARED).
    amount: string;
    notes: string;
    date: Date;
  }>({
    onSubmit: async (values) => {
      const tagsToUpdate = selectedTags.map((tag: string) => {
        const id = parseInt(tag, 10);
        return isNaN(id) ? tag : id;
      });
      const update: lunchMoney.TransactionUpdate = {
        payee: values.payee,
        category_id: values.category_id ? parseInt(values.category_id) : undefined,
        tags: tagsToUpdate,
        status: values.reviewed ? lunchMoney.TransactionStatus.CLEARED : lunchMoney.TransactionStatus.UNCLEARED,
        notes: values.notes,
        date: date ? formattedDate.format(date) : undefined,
      };

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
      recuring_id: transaction.recurring_id?.toString() ?? "",
      amount: transaction.amount,
      notes: transaction.notes,
      // We can assume that if the user is editing and updating the
      // transaction, it is considered reviewed until the user manually
      // unchecks the box.
      // XXX: use tx default state.
      reviewed: true,
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

  const renderRecuring = (recurings?: lunchMoney.RecurringItem[]) => {
    if (!recurings) return null;

    return recurings.map((recuring) => {
      return (
        <Form.Dropdown.Item
          key={recuring.id}
          value={String(recuring.id)}
          title={recuring.payee}
          icon={recuring.id === transaction.recurring_id ? Icon.Check : undefined}
        />
      );
    });
  };

  const tagItems = useMemo(() => {
    if (!tags) return [];
    const items = tags.map((tag: { id: Key | null | undefined; name: string }) => (
      <Form.TagPicker.Item key={tag.id} value={String(tag.id)} title={tag.name} />
    ));
    const newItems = newTags.map((tagName) => <Form.TagPicker.Item key={tagName} value={tagName} title={tagName} />);
    return [...items, ...newItems];
  }, [tags, newTags]);

  const AddTag = () => {
    const { handleSubmit, itemProps } = useForm<{ tag: string }>({
      onSubmit(values) {
        console.log(values);
        setNewTags([...newTags, values.tag]);
        setSelectedTags([...selectedTags, values.tag]);
        pop();
      },
      validation: {
        tag: (value) => {
          if (tags && tags.find((el) => el.name == value)) {
            return "This Tag already exist";
          }
          if (!value) {
            return "Name is required";
          }
        },
      },
    });

    return (
      <Form
        actions={
          <ActionPanel>
            <Action.SubmitForm title="Create" onSubmit={handleSubmit} />
          </ActionPanel>
        }
      >
        <Form.TextField title="Name" placeholder="My Tag" {...itemProps.tag} />
      </Form>
    );
  };

  return (
    <Form
      isLoading={isLoadingCategories || isLoadingTags || isLoadingRecuringItems}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save Changes" onSubmit={handleSubmit} />
          <Action.Push title="Add Tag" shortcut={{ modifiers: ["cmd"], key: "t" }} target={<AddTag />} />
          <Action title="Back" shortcut={{ modifiers: [], key: "arrowLeft" }} onAction={pop} />
        </ActionPanel>
      }
    >
      <Form.Description
        title={"Transaction"}
        text={`${getFormatedAmount(transaction)} using '${transaction.plaid_account_name}'`}
      />
      <Form.TextField title="Payee" placeholder="Transaction payee" {...itemProps.payee} />
      <Form.Dropdown title="Category" {...itemProps.category_id}>
        <Form.Dropdown.Item title="No Category" value="" icon={Icon.XMarkCircle} />
        {renderCategories(categories)}
      </Form.Dropdown>
      <Form.TextArea title="Notes" {...itemProps.notes} />
      <Form.TagPicker id="tags" title="Tags" value={selectedTags} onChange={setSelectedTags}>
        {tagItems}
      </Form.TagPicker>
      <Form.DatePicker title="Date" type={Form.DatePicker.Type.Date} value={date} onChange={setDate} id="date" />
      <Form.Dropdown title="Recuring Expenses" {...itemProps.recuring_id}>
        <Form.Dropdown.Item title="No Recuring Expenses" value="" icon={Icon.XMarkCircle} />
        {renderRecuring(recuringItems)}
      </Form.Dropdown>
      <Form.Checkbox title="Status" label="Reviewed" {...itemProps.reviewed} />
    </Form>
  );
}
