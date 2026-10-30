"use client";

import dynamic from "next/dynamic";

const RwandaDistrictMap = dynamic(
  () => import("@/components/innovations/rwanda-district-map"),
  { ssr: false },
);

export default function DevelopmentMapPage() {
  return <RwandaDistrictMap />;
}