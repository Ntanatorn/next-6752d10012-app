"use client";

import Image from "next/image";
import Link from "next/link";
import runIcon from "../assets/images/run.jpg";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Image src={runIcon} alt="Run" width={200} className="mb-8" />
        <h1 className="text-3xl font-bold text-red-700 mb-2">Welcome to MyRun</h1>
        <h2 className="text-lg text-red-700 mb-2">Your personal running record</h2>
        <p className="text-2xl text-red-700 mb-6">You can create and update your running record</p>

        <div className="flex flex-col gap-3">
          <Link
            href="/show-all-myrun"
            className="bg-green-500 px-6 py-2 rounded text-white hover:bg-green-600 transition"
          >
            🏃‍♂️ ดูข้อมูลการวิ่งทั้งหมด
          </Link>

          <Link
            href="/create-myrun"
            className="bg-blue-500 px-6 py-2 rounded text-white hover:bg-blue-600 transition"
          >
            ➕ เพิ่มข้อมูลการวิ่งใหม่
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
