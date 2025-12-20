import type { PropsWithChildren } from "react";
import { Footer } from "@/src/app/layouts/main-layout/footer/Footer.tsx";
import { Header } from "@/src/app/layouts/main-layout/header/Header.tsx";
import "./MainLayout.css";

type MainLayoutProps = PropsWithChildren;

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="MainLayout">
      <Header />
      <main className="MainLayoutContent">{children}</main>
      <Footer />
    </div>
  );
};
