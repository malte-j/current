import { useQuery } from "react-query";
import { useAuth } from "./Auth";

async function fetchUser(token: string, userId?: string ): Promise<User> {
  const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/users/' + userId, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      'Authorization': token
    }
  })

  if (!res.ok) {
    throw new Error('Fetching Users failed')
  }

  return res.json();
}

export const useUser = (userId?: string) => {
  const auth = useAuth();
  return useQuery<User>(
    ["user", userId],
    () => fetchUser(auth.user!.authToken, userId), {
      enabled: !!userId,
    })
}