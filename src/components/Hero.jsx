import Image from "next/image";
import { SearchBar } from "./SearchBar";
import { siteConfig } from "@/constants";

export function Hero() {
  return (
    <section className="relative flex min-h-[500px] items-center justify-center bg-gradient-to-br from-orange-500 to-orange-700 px-4">
      <Image
        src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920"
        alt=""
        fill
        priority
        className="object-cover opacity-20"
        sizes="100vw"
      />
      <div className="relative z-10 max-w-2xl text-center text-white">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          {siteConfig.tagline}
        </h1>
        <p className="mb-8 text-lg text-white/80">
          {siteConfig.description}
        </p>
        <SearchBar className="mx-auto max-w-md" />
      </div>
    </section>
  );
}
