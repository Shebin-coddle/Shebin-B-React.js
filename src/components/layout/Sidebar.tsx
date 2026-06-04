import { NavLink } from "react-router-dom";

type MenuItem = {
  label: string;
  path: string;
};

type SidebarProps = {
  title: string;
  items: MenuItem[];
};

function Sidebar({ title, items }: SidebarProps) {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-logo">{title}</h2>

      <nav className="admin-menu">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="admin-menu-link"
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;