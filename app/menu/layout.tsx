import { Header } from "@/components/header";
import MenuOption from '../../components/menuOptions';
import Image from "next/image";
import TabMenu from "@/components/tab-menu";
import MenuList from "@/components/menuListing";

type Props = {
  children: React.ReactNode;
};

const MenuLayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <MenuList />
    </>
  );
};

export default MenuLayout;
