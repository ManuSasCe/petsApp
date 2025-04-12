import React from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  Footer,
  DarkThemeToggle,
  Select,
  NavbarCollapse,
} from "flowbite-react";
import { useTranslation } from "react-i18next";
import { ChangeEvent } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { i18n } = useTranslation();
  const onclickLaguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const language = e.target.value;
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
    
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 space-y-4 dark:bg-gray-900">
      <Navbar
        fluid
        rounded
        className="border-b bg-white shadow-sm dark:bg-gray-800"
      >
        <Navbar.Brand as={Link} to="/">
          <span className="self-center whitespace-nowrap text-2xl font-bold text-blue-600 dark:text-blue-400">
            Fever Pets®
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2 gap-2">
          <DarkThemeToggle />
          <div className="flex justify-between">
            <Select value={i18n.language} onChange={onclickLaguageChange}>
              <option value="en">En</option>
              <option value="es">Es</option>
            </Select>
          </div>
        </div>
      </Navbar>

      <main className="container mx-auto flex-1 px-2 lg:py-4">
        <div className="mx-auto max-w-screen-xl">{children}</div>
      </main>

      <Footer
        container
        className="mt-auto border-t bg-white shadow-inner dark:bg-gray-800"
      >
        <Footer.Copyright
          href="#"
          by="Fever Pets®"
          year={new Date().getFullYear()}
          className="w-full text-center text-gray-500 dark:text-gray-400"
        />
      </Footer>
    </div>
  );
}
