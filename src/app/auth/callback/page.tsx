'use client';

import { createClient } from '../../../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.refresh();
        router.push('/');
      }
    });
  }, [router, supabase.auth]);

  return <div>Loading...</div>;
}