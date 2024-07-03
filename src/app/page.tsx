import Image from "next/image";
import logo from "@/app/assets/logo.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Github } from "lucide-react";

export default function Home() {
  const { userId } = auth();

  if (userId) redirect("/workouts");

  return (
    <main className='flex flex-col h-screen items-center justify-center gap-5'>
      <div className='flex items-center gap-4'>
        <Image src={logo} alt='PumpUp Logo' width={100} height={100} />
        <span className='font-extrabold tracking-tight text-4xl lg:text-5xl'>
          Pump Up
        </span>
      </div>
      <p className='max-w-prose text-center '>
        An smart workout tracker app with AI integration, built with OpenAI,
        MongoDB, Pinecone, Next.js, and more
      </p>
      <Button size='lg' asChild>
        <Link href='/workouts/today'>Get Started</Link>
      </Button>
      <Link href='https://github.com/vai195/PumpUp-AI-Exercise-Tracker'>
        <Github />
      </Link>
    </main>
  );
}
