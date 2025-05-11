import {
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  ScrollArea,
} from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/use-store";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMoneyBillWave,
  faUser,
  faBalanceScale,
} from "@fortawesome/free-solid-svg-icons";
import CreateExpenseModal from "../modals/create-expense-modal";

const ExpenseTab = observer(() => {
  const { householdStore } = useStore();
  const { id } = useParams();
  const [open, setOpen] = useState(false);

  const { data: expenses, isLoading: loadingExpenses } = useQuery({
    queryKey: ["expenses", id],
    queryFn: () => householdStore.getExpenses(id!),
  });

  const { data: balances } = useQuery({
    queryKey: ["balances", id],
    queryFn: () => householdStore.getBalances(id!),
  });

  const { data: suggestions } = useQuery({
    queryKey: ["settle-up", id],
    queryFn: () => householdStore.getSettleUpSuggestions(id!),
  });

  return (
    <Stack>
      <Group position="apart">
        <Title order={3}>Expenses</Title>
        <Button
          leftIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => setOpen(true)}
        >
          Add Expense
        </Button>
      </Group>

      <Divider label="Expenses List" labelPosition="center" my="sm" />
      <ScrollArea h={250}>
        <Stack spacing="xs">
          {expenses?.map((exp) => (
            <Card key={exp._id} shadow="sm" padding="md" radius="md" withBorder>
              <Group position="apart">
                <Text weight={500}>{exp.name}</Text>
                <Badge color="blue">${exp.amount.toFixed(2)}</Badge>
              </Group>
              <Text size="sm" color="dimmed" mt={4}>
                <FontAwesomeIcon icon={faUser} className="me-1" /> Paid by:{" "}
                {exp.payer.fullName}
              </Text>
              <Text size="xs" mt={2}>
                Participants:{" "}
                {exp.participants
                  .map(
                    (p) => `${p.user.fullName} (${Math.round(p.share * 100)}%)`
                  )
                  .join(", ")}
              </Text>
              <Text size="xs" color="dimmed">
                Date: {format(new Date(exp.date), "PP")}
              </Text>
            </Card>
          ))}
        </Stack>
      </ScrollArea>

      <Divider label="Balances" labelPosition="center" my="sm" />
      <Stack spacing="xs">
        {balances &&
          Object.entries(balances).map(([user, amt]: any) => (
            <Text key={user}>
              <FontAwesomeIcon icon={faBalanceScale} className="me-2" />
              {householdStore.getUserNameById(user)}:{" "}
              <span style={{ color: amt < 0 ? "red" : "green" }}>
                {amt < 0 ? "-" : "+"}${Math.abs(amt).toFixed(2)}
              </span>
            </Text>
          ))}
      </Stack>

      <Divider label="Settle Up Suggestions" labelPosition="center" my="sm" />
      <Stack spacing="xs">
        {suggestions?.length === 0 && <Text size="sm">All settled up 🎉</Text>}
        {suggestions?.map((tx: any, idx: number) => (
          <Text key={idx} size="sm">
            <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
            {householdStore.getUserNameById(tx.from)} pays $
            {tx.amount.toFixed(2)} to {householdStore.getUserNameById(tx.to)}
          </Text>
        ))}
      </Stack>

      <CreateExpenseModal
        opened={open}
        onClose={() => setOpen(false)}
        householdId={id!}
      />
    </Stack>
  );
});

export default ExpenseTab;
