import {
  Avatar,
  Burger,
  Button,
  Container,
  createStyles,
  Drawer,
  Group,
  Stack,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useStore } from "../../hooks/use-store";
import { getImage } from "../../utils/image-map";

const useStyles = createStyles((theme) => ({
  navbar: {
    display: "flex",
    maxHeight: "55px",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100vw",
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: `linear-gradient(
  45deg,
  ${theme.fn.rgba(theme.colors.violet[5], 0.93)},
  ${theme.fn.rgba(theme.colors.indigo[6], 0.93)},
  ${theme.fn.rgba(theme.colors.indigo[6], 0.93)}
 
)`,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: `1px solid ${theme.fn.rgba(theme.colors.gray[9], 0.2)}`,
    boxShadow: theme.shadows.md,
    color: theme.white,
  },
}));

export const NavBar = observer(function NavBar() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState("Home");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { classes } = useStyles();
  const { authStore } = useStore();
  const navigate = useNavigate();

  const isLoggedIn = authStore.IsAuthenticated;

  const loginLink = [
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
  ];
  const logoutLink = [
    {
      label: "Logout",
      href: "/",
    },
  ];

  const getLinks = () => {
    return isLoggedIn ? logoutLink : loginLink;
  };

  const items = getLinks().map((link) => (
    <Button
      key={link.label}
      variant="white"
      color={active === link.label ? "blue" : "gray"}
      onClick={() => {
        setActive(link.label);
        close();
        navigate(link.href);
      }}
      component="a"
    >
      {link.label}
    </Button>
  ));

  return (
    <Container fluid px="md" py="sm" className={classes.navbar}>
      <img
        src={getImage("logo")}
        alt="Logo"
        onClick={() => navigate("/")}
        style={{
          objectFit: "cover",
          cursor: "pointer",
          width: "40px",
          height: "40px",
        }}
      />

      {!isMobile && (
        <Group spacing="md">
          {items}
          {isLoggedIn && <Avatar size="md" radius="xl" />}
        </Group>
      )}

      {isMobile && (
        <>
          {!opened && <Burger opened={false} onClick={toggle} />}
          <Drawer
            opened={opened}
            onClose={close}
            title={
              <img width={30} height={30} src={getImage("logo")} alt="Logo" />
            }
            padding="md"
            size="xs"
          >
            <Stack spacing="md" align="center">
              {isLoggedIn && (
                <Avatar color="blue" radius="xl">
                  {authStore.User != null ? (
                    <img
                      src={authStore.User?.profilePictureUrl}
                      alt="Profile"
                    />
                  ) : (
                    "A"
                  )}
                </Avatar>
              )}
              {items}
            </Stack>
          </Drawer>
        </>
      )}
    </Container>
  );
});
