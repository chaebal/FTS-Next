import { signIn, signOut, auth } from "@/auth";

export default async function SignIn() {
  const session = await auth();
  console.log(session);
  const user = session?.user;

  return user ? (
    <>
      <h1 className="text-2x1">Welcome {user.name}</h1>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button className="p-2 border-2 bg-blue-400">Sign Out</button>
      </form>
    </>
  ) : (
    <>
      <h1 className="text-x1">You are not authenticated. Click below.</h1>
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/secret" });
        }}
      >
        <button className="p-2 border-2 bg-blue-400">Sign In</button>
      </form>
    </>
  );
}
