import { useState } from "react";
import AIChatBox from "./AIChatBox";
import { Button } from "./ui/button";
import { BotMessageSquare } from "lucide-react";

export default function AIChatButton() {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setChatBoxOpen(true)}>
        <BotMessageSquare size={20} className='mr-2' />
        AI Chat
      </Button>
      <AIChatBox open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
    </>
  );
}
