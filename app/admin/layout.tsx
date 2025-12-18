import AdminNav from "../components/admin/admin-nav";

export const metadata = {
  title: "EasyByFar Admin",
  description: "EasyByFar Admin Dashboard",
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
};

export default AdminLayout;
