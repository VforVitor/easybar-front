import { Header } from "@/components/header";
import TableList from "@/components/tableList";
import TabList from "@/components/tabList";
import UserInfo from "@/components/userInfo";

type Props = {
  children: React.ReactNode;
};

const ManagementLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-[#5f0f40] mb-6">Área do Funcionário</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TableList />
          <TabList />
          <UserInfo />
        </div>
      </main>
    </div>
  );
};

export default ManagementLayout;
