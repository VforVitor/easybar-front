import { Header } from "@/components/header";
import OrdersList from "@/components/orderList";

type Props = {
  children: React.ReactNode;
};

const OrderLayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <OrdersList />
    </>
  );
};

export default OrderLayout;
