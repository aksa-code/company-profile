// src/app/career/page.tsx
import { getCareers } from "../../lib/careerService";
import CareerPageClient from "./CareerPageClient";

export const revalidate = 0; // Memastikan data selalu segar

export default async function CareerPage() {
  const careersData = await getCareers();

  return <CareerPageClient careersData={careersData} />;
}