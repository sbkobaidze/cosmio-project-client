import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNotifications } from "@/lib/state";

const NotificationsDialog = () => {
  const { showDialog, notifications } = useNotifications((state) => ({
    showDialog: state.showDialog,
    notifications: state.notifications,
  }));
  return (
    <Dialog
      open={showDialog}
      onOpenChange={() => {
        useNotifications.setState({ showDialog: false });
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        <div>
          {notifications.length ? (
            notifications.map((notification, index) => (
              <div key={index}>{notification}</div>
            ))
          ) : (
            <div>No notifications</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsDialog;
