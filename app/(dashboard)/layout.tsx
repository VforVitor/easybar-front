import { Header } from "@/components/header";
import MenuOption from '../../components/menuOptions';
import Image from "next/image";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <div className="h-full lg:flex flex-col items-center justify-center px-4 py-10">
        <Image src="/ilust_easybar_home.svg" alt="alt" width={700} height={700} />
      </div>
    </>
  );
};

export default DashboardLayout;
