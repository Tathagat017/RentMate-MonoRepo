import { Button, Group, Paper, Stack, Text } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "../../hooks/use-store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

interface HistoryEntry {
  type: "chore" | "expense";
  action: string;
  date: string;
}

interface HistoryTabProps {
  householdId: string;
}

const HistoryTab = observer(({ householdId }: HistoryTabProps) => {
  const { householdStore } = useStore();

  const { data: history, isLoading } = useQuery({
    queryKey: ["history", householdId],
    queryFn: async () => {
      return await householdStore.getHistory(householdId);
    },
  });

  const handleExportCSV = async () => {
    try {
      const response = await householdStore.exportHistoryToCSV(householdId);
      // Create a blob from the CSV data
      const blob = new Blob([response], { type: "text/csv" });
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "history.csv");
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Stack spacing="md">
      <Group position="right">
        <Button
          leftIcon={<FontAwesomeIcon icon={faFileCsv} />}
          onClick={handleExportCSV}
        >
          Export to CSV
        </Button>
      </Group>

      <Stack spacing="xs">
        {history?.map((entry: HistoryEntry, index: number) => (
          <Paper key={index} p="md" withBorder>
            <Group position="apart">
              <Stack spacing={0}>
                <Text size="lg" weight={500}>
                  {entry.action}
                </Text>
                <Text size="sm" color="dimmed">
                  {format(new Date(entry.date), "MMMM d, yyyy h:mm a")}
                </Text>
              </Stack>
              <Text
                size="sm"
                color={entry.type === "chore" ? "blue" : "green"}
                weight={500}
              >
                {entry.type.toUpperCase()}
              </Text>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
});

export default HistoryTab;
