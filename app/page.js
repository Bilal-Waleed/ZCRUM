export default function Home() {
  let a; 
  return (
    <div>
      <h1>Home</h1>
      <Image
        src="/vercel.svg"
        alt="Vercel Logo"
        className="dark:invert"
        width={100}
        height={24}
        priority
      />
    </div>
  );
}

