import { Link, useLocation } from "react-router-dom";
import { labels } from "./Labels/BreadCrumpsLabels";
import "../styles/BreadCrumps.css"

function BreadCrumbs() {
  const location = useLocation();

  const paths = location.pathname
    .split("/")
    .filter(Boolean);

  return (
    <nav className="breadcrumbs">
      <Link to="/">Home</Link>

      {paths.map((path, index) => {
        const route = "/" + paths.slice(0, index + 1).join("/");

        return (
          <span key={route}>
            {" > "}
            <Link to={route}>
              {labels[path]}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}

export default BreadCrumbs;