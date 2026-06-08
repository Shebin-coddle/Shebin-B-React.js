import { useEffect, useState } from "react";
import { getAllUsers } from "../services/UserService";

type NewProps = {
  userNameMap: Record<number, string>;
};

function withUsersMap<P extends object>(
  Component: React.ComponentType<P & NewProps>
) {
  function Wrapped(props: P) {
    const [userNameMap, setUserNameMap] = useState<Record<number, string>>({});

    useEffect(() => {
      async function fetchUsers() {
        try {
          const users = await getAllUsers();

          const map = Object.fromEntries(
            users.map((u) => [
              u.id,
              `${u.first_name} ${u.last_name}`,
            ])
          );

          setUserNameMap(map);
        } catch (err) {
          console.error("Failed to load users", err);
        }
      }

      fetchUsers();
    }, []);

    return (
      <Component
        {...props}
        userNameMap={userNameMap}
      />
    );
  }

  Wrapped.displayName = `withUsersMap(${Component.displayName || Component.name})`;

  return Wrapped;
}

export default withUsersMap;  