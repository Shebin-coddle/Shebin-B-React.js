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
    <aside className="sidebar">
      <h2 className="logo">{title}</h2>

      <nav className="menu">
        {items.map((item) => (
          <NavLink key={item.path} to={item.path} className="menu-link">
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
