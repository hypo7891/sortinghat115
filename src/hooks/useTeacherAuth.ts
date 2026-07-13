import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { subscribeAuthState } from '../firebase/auth';

export function useTeacherAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeAuthState((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}
