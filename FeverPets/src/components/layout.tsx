import { Navbar } from "flowbite-react";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="container mx-auto px-4">
      <Navbar fluid rounded>
        <Navbar.Brand as={NavLink} to="/">
          <span className="text-xl font-semibold">Fever Pets</span>
        </Navbar.Brand>
        <Navbar.Collapse>
          <Navbar.Link as={NavLink} to="/">
            Inicio
          </Navbar.Link>
          <Navbar.Link as={NavLink} to="/about">
            Acerca de
          </Navbar.Link>
          <Navbar.Link as={NavLink} to="/contact">
            Contacto
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>

      <main className="py-8">
        <Outlet></Outlet>
      </main>
    </div>
  );
}
