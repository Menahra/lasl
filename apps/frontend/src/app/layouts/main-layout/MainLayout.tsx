import type { PropsWithChildren } from "react";
import { Header } from "@/src/app/layouts/main-layout/header/Header.tsx";

type MainLayoutProps = PropsWithChildren;

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};
