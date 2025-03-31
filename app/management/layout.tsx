import { Header } from "@/components/header";
import MenuOption from '../../components/menuOptions';
import TableList from "@/components/tableList";
import TabList from "@/components/tabList";

type Props = {
  children: React.ReactNode;
};

const ManagementLayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <TableList />
      <TabList />
    </>
  );
};

export default ManagementLayout;
