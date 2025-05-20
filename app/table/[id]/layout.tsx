import { Header } from "@/components/header";
import TableView from "@/components/tableView";

type Props = {
  children: React.ReactNode;
};

const TableLayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <TableView />
    </>
  );
};

export default TableLayout;
