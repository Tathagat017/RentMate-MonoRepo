import {
  Button,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "../../hooks/use-store";
import { ExpensePayload, ExpenseParticipant } from "../../types/expense";
import { Types } from "mongoose";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/date-picker.css";
import { observer } from "mobx-react-lite";
import { useState } from "react";

const CreateExpenseModal = observer(function CreateExpenseModal({
  householdId,
}: {
  householdId: string;
}) {
  const { uiViewStore, authStore, householdStore } = useStore();
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );

  const form = useForm<ExpensePayload>({
    initialValues: {
      householdId: new Types.ObjectId(householdId),
      name: "",
      amount: 0,
      date: new Date(),
      payer: new Types.ObjectId(),
      participants: [],
    },
    validate: {
      name: (value) => (!value ? "Name is required" : null),
      amount: (value) => (value <= 0 ? "Amount must be greater than 0" : null),
      payer: (value) => (!value ? "Payer is required" : null),
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await authStore.getUsers();
    },
  });

  const handleClose = () => {
    uiViewStore.toggleCreateExpenseModal(false);
    form.reset();
    setSelectedParticipants([]);
  };

  const handleSubmit = async (values: ExpensePayload) => {
    try {
      await householdStore.createExpense(values);
      handleClose();
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  const userOptions =
    users?.map((user) => ({
      value: user._id.toString(),
      label: user.name,
    })) || [];

  const handleParticipantChange = (selectedUserIds: string[]) => {
    setSelectedParticipants(selectedUserIds);
    const shareAmount = form.values.amount / (selectedUserIds.length || 1);

    const participants: ExpenseParticipant[] = selectedUserIds.map(
      (userId) => ({
        user: new Types.ObjectId(userId),
        share: shareAmount,
      })
    );

    form.setFieldValue("participants", participants);
  };

  return (
    <Modal
      opened={uiViewStore.IsCreateExpenseModalOpen}
      onClose={handleClose}
      title="Create New Expense"
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="md">
          <TextInput
            label="Expense Name"
            placeholder="Enter expense name"
            required
            {...form.getInputProps("name")}
          />

          <NumberInput
            label="Amount"
            placeholder="Enter amount"
            required
            min={0}
            precision={2}
            {...form.getInputProps("amount")}
          />

          <Select
            label="Payer"
            placeholder="Select payer"
            data={userOptions}
            required
            value={form.values.payer.toString()}
            onChange={(value) =>
              value && form.setFieldValue("payer", new Types.ObjectId(value))
            }
          />

          <MultiSelect
            label="Participants"
            placeholder="Select participants"
            data={userOptions}
            multiple
            value={selectedParticipants}
            onChange={handleParticipantChange}
            clearable
          />

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "14px",
              }}
            >
              Date
            </label>
            <DatePicker
              selected={form.values.date}
              onChange={(date: Date | null) =>
                date && form.setFieldValue("date", date)
              }
              dateFormat="MMMM d, yyyy"
              wrapperClassName="date-picker-wrapper"
              className="mantine-Input-input"
            />
          </div>

          <Group position="right" mt="md">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Create Expense</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
});

export default CreateExpenseModal;
