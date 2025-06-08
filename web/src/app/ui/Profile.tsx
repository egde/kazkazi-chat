import { auth0 } from "@/lib/auth0";
import { Button } from "./Button";

export default async function ProfileServer() {
    const session = await auth0.getSession();
    const user = session?.user;

    const app_base_url = process.env.NEXT_PUBLIC_APP_BASE_URL

    return (
        <div className="flex items-center space-x-3">
            {user ? (
                <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={user.picture} alt={user.name} className="rounded-full w-8 h-8 object-cover" />
                    <Button href={`/auth/logout?returnTo=${app_base_url}/logout`} size="small" variant="secondary">
                        Logout
                    </Button>
                </>
            ) : (
                <Button href="/auth/login" size="small" variant="primary">
                    Login
                </Button>
            )}
        </div>
    );
}