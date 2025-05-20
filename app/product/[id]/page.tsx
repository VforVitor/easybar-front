'use client'
import { Header } from '@/components/header';
import ProductDetails from '@/components/productView';
import { useParams } from 'next/navigation';

export default function ProductPage() {
  const params = useParams();
  const { id } = params; // Dynamic ID from the route

  return (
    <>
      <Header />
      <ProductDetails />
    </>
  );
}