"use client";

import { useState } from "react";
import CampusAmbassadorEnrollModal from "./CampusAmbassadorEnrollModal";
import { UserPlus } from "lucide-react";

export default function CampusAmbassadorEnrollButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-8 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center mx-auto space-x-2 border border-purple-500 hover:scale-105"
      >
        <UserPlus size={20} />
        <span>Enroll Now</span>
      </button>

      <CampusAmbassadorEnrollModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}