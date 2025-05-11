import { Button, Group, Paper, Stack, Text } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "../../hooks/use-store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMinus } from "@fortawesome/free-solid-svg-icons";
import { Types } from "mongoose";

interface MemberTabProps {
  members: Types.ObjectId[];
  ownerId: Types.ObjectId;
}

const MemberTab = observer(({ members, ownerId }: MemberTabProps) => {
  const { authStore, uiViewStore } = useStore();
  const isOwner = authStore.user?._id.toString() === ownerId.toString();

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await authStore.getUsers();
    },
  });

  const handleRemoveMember = async (memberId: string) => {
    // TODO: Implement remove member functionality
    console.log("Remove member:", memberId);
  };

  const getMemberName = (memberId: string) => {
    const member = users?.find(
      (user) => user._id.toString() === memberId.toString()
    );
    return member?.name || "Unknown User";
  };

  return (
    <Stack spacing="md">
      {isOwner && (
        <Group position="right">
          <Button onClick={() => uiViewStore.toggleInviteMemberModal(true)}>
            Invite Member
          </Button>
        </Group>
      )}

      <Stack spacing="xs">
        {members.map((memberId) => (
          <Paper key={memberId.toString()} p="md" withBorder>
            <Group position="apart">
              <Stack spacing={0}>
                <Text size="lg" weight={500}>
                  {getMemberName(memberId.toString())}
                </Text>
                <Text size="sm" color="dimmed">
                  {memberId.toString() === ownerId.toString()
                    ? "Owner"
                    : "Member"}
                </Text>
              </Stack>
              {isOwner && memberId.toString() !== ownerId.toString() && (
                <Button
                  variant="subtle"
                  color="red"
                  onClick={() => handleRemoveMember(memberId.toString())}
                >
                  <FontAwesomeIcon icon={faUserMinus} />
                </Button>
              )}
            </Group>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
});

export default MemberTab;
