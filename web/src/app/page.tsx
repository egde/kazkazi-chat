import { Button } from "./ui/Button";

export default function Home() {
    return (
        <div className="min-h-[80vh] flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold mb-6 text-center">Kazkazi Chat</h1>
            <p className="text-lg mb-8 text-center">
                Connect, chat, and collaborate instantly with Kazkazi Chat.
            </p>
            <Button href='/chat' size="large" variant="primary">Start Chatting</Button>
        </div>
    );
}