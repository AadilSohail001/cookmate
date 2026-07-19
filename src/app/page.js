import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";

const FeaturedSection = dynamic(() => import("@/components/HomeSections").then((m) => m.FeaturedSection));
const CategoriesSection = dynamic(() => import("@/components/HomeSections").then((m) => m.CategoriesSection));
const PopularSection = dynamic(() => import("@/components/HomeSections").then((m) => m.PopularSection));

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedSection />
      <CategoriesSection />
      <PopularSection />
    </>
  );
}
