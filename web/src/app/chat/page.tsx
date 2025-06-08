import ChatWindow from "@/app/ui/ChatWindow";
import { redirect } from 'next/navigation';
import { auth0 } from "@/lib/auth0";

async function ChatPage() {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    redirect('/auth/login?returnTo=/chat');
  }

  return (
    <div>
      <ChatWindow />
    </div>
  );
}

export default ChatPage;