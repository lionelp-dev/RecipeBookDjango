type HomeProps = {
  message: string;
};

export default function Home({ message }: HomeProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-6 text-white">
      <h1 className="text-4xl font-bold">{message}</h1>
    </main>
  );
}
