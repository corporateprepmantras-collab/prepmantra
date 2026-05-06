'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"

function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include', 
    });
    router.push('/'); 
  };

  return (<>
  
    {/* <button className='bg-red-600' onClick={handleLogout}>
      Log out
    </button> */}
    <Button variant="destructive" onClick={handleLogout}>Log out</Button>
  </>
   
  );
}

export default LogoutButton;