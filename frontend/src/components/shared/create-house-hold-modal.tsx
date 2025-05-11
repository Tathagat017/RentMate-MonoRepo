import { Button, createStyles, Modal, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/use-store";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    gap: theme.spacing.md,
    height: 50,
  },
}));

const CreateHouseHoldModal = observer(
  ({ type }: { type: "create" | "join" }) => {
    const { uiViewStore, householdStore } = useStore();
    const { classes } = useStyles();
    const [name, setName] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
      uiViewStore.toggleCreateHouseHoldModal(false);
    };

    const handleCreateHouseHold = async () => {
      setLoading(true);
      const response = await householdStore.createHouseHold({
        name,
      });
      if (response) {
        notifications.show({
          title: "Success",
          message: "House hold created!",
          color: "green",
        });
        handleClose();
      } else {
        notifications.show({
          title: "Error",
          message: "Failed to create house hold",
          color: "red",
        });
      }
      setLoading(false);
    };

    const handleJoinHouseHold = () => {
      notifications.show({
        title: "Success",
        message: "House hold joined!",
        color: "green",
      });
    };
    return (
      <Modal
        opened={uiViewStore.IsCreateHouseHoldModalOpen}
        onClose={handleClose}
        title={type === "create" ? "Create House Hold" : "Join House Hold"}
        withinPortal
        styles={{
          body: {
            padding: 15,
          },
        }}
        centered
      >
        {type === "create" && (
          <TextInput
            label="House Hold Name"
            placeholder="House Hold Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        {type === "join" && (
          <TextInput
            label="Join Code"
            placeholder="Join Code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
          />
        )}

        <div className={classes.footer}>
          <Button onClick={handleClose} variant="light">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (type === "create") {
                handleCreateHouseHold();
              } else {
                handleJoinHouseHold();
              }
            }}
            loading={loading}
          >
            {type === "create" ? "Create" : "Join"}
          </Button>
        </div>
      </Modal>
    );
  }
);

export default CreateHouseHoldModal;
