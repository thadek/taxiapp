"use client";
import { useSession } from 'next-auth/react';

const AuthorizedOnly = () => {
  const { data: session, status } = useSession();



  if (status === "loading") {
    return <p>Loading...</p>;
  }
  console.log(session);

  return (
    <div>
      <h1>Authorized Only Page</h1>
      <pre>
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>
    </div>
  );
};

export default AuthorizedOnly;