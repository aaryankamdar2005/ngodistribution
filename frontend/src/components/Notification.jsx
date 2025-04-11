import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Notification() {
  const { notifications } = useContext(UserContext);

  return (
    <div className="bg-white p-2 rounded-md my-4">
      {notifications.map((notif, index) => (
        <p key={index} className="text-sm">{notif.message}</p>
      ))}
    </div>
  );
}
export default Notification;
