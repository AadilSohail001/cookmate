import Link from "next/link";
import Image from "next/image";

export function CategoryCard({ category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex h-48 items-end overflow-hidden rounded-xl shadow-sm ring-1 ring-zinc-200 transition-all hover:shadow-md dark:ring-zinc-800"
    >
      <Image
        src={category.image}
        alt={category.name}
        fill
        loading="lazy"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="relative z-10 p-4 text-white">
        <h3 className="text-lg font-semibold">{category.name}</h3>
        <p className="text-sm text-white/80">{category.description}</p>
      </div>
    </Link>
  );
}
