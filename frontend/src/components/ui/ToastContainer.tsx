import { useNotification } from '../../context/NotificationContext';
import Toast from './Toast';

export default function ToastContainer() {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none items-end">
            {notifications.map((notification) => (
                <Toast
                    key={notification.id}
                    notification={notification}
                    onClose={removeNotification}
                />
            ))}
        </div>
    );
}
