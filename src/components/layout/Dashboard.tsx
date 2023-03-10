import Navbar from "../UI/Navbar";
import Footer from "../UI/Footer";
import Sidebar from "../UI/Sidebar";
import { useRouter } from "next/router";
import QueryNotification from "../UI/QueryNotification";

interface DashboardLayoutProps {
  children: any;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();

  const notificationMessage = router.query.notificationMessage as string;
  const notificationType = router.query.notificationType as
    | ""
    | "error"
    | "success";

  return (
    <div className="flex min-h-screen flex-col bg-light-900 dark:bg-dark-900">
      <div id="notifications" />
      <div id="modal" />
      <Navbar />
      <main className="flex flex-1 overflow-auto bg-light-900 text-light-50 dark:bg-dark-900 dark:text-dark-50">
        <Sidebar />
        <div className="flex w-full flex-1 p-4">{children}</div>
      </main>
      <Footer />
      {notificationMessage && (
        <QueryNotification
          messageText={notificationMessage}
          messageType={notificationType}
        />
      )}
    </div>
  );
}
