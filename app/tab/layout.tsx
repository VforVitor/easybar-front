import { Header } from "@/components/header";
import MenuOption from '../../components/menuOptions';
import Image from "next/image";
import TabMenu from "@/components/tab-menu";

type Props = {
  children: React.ReactNode;
};

const TabLayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <TabMenu />
    </>
  );
};

export default TabLayout;
