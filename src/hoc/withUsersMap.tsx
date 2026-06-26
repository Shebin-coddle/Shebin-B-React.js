import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { getAllUsers } from "../services/UserService";

type InjectedProps = {
  userNameMap: Record<number, string>;
};

function withUsersMap<P extends object>(
  Component: ComponentType<P & InjectedProps>
): ComponentType<P> {
  function Wrapped(props: P) {
    const [userNameMap, setUserNameMap] = useState<Record<number, string>>({});

    useEffect(() => {
      async function fetchUsers() {
        try {
          const users = await getAllUsers();

          const map: Record<number, string> = Object.fromEntries(
            users.map((u) => [
              u.id,
              `${u.first_name} ${u.last_name}`,
            ])
          );

          setUserNameMap(map);
        } catch (error) {
          console.error("Failed to load users", error);
        }
      }

      fetchUsers();
    }, []);

    return <Component {...props} userNameMap={userNameMap} />;
  }

  Wrapped.displayName = `withUsersMap(${Component.displayName || Component.name})`;

  return Wrapped;
}

export default withUsersMap;