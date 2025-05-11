import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/use-store";
import NoHouseHoldDashboard from "./no-house-hold-dashboard";
import HouseHoldCardListDashboard from "./household-card-list-dashboard";

const DashboardComponent = observer(() => {
  const { authStore } = useStore();

  return authStore.User?.households.length == 0 ? (
    <NoHouseHoldDashboard />
  ) : (
    <HouseHoldCardListDashboard />
  );
});

export default DashboardComponent;
