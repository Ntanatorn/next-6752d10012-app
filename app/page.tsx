"use client";

import Image from "next/image";
import Link from "next/link";
import runIcon from "../assets/images/run.jpg";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-100 to-green-100">
        <Image src={runIcon} alt="วิ่ง" width={220} className="mb-8 rounded-full shadow-lg" />
        <h1 className="text-4xl font-extrabold text-orange-600 mb-2 drop-shadow-md">ยินดีต้อนรับสู่ MyRun</h1>
        <h2 className="text-xl font-semibold text-orange-500 mb-4">บันทึกการวิ่งส่วนตัวของคุณ</h2>
        <p className="text-lg text-orange-500 mb-8 max-w-md">
          คุณสามารถบันทึกข้อมูลการวิ่ง ดูสถิติ และติดตามความก้าวหน้าของตัวเองได้ที่นี่
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/show-all-myrun"
            className="bg-green-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-green-600 transition transform hover:-translate-y-1"
          >
            🏃‍♂️ ดูข้อมูลการวิ่งทั้งหมด
          </Link>

          <Link
            href="/create-myrun"
            className="bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-600 transition transform hover:-translate-y-1"
          >
            ➕ เพิ่มข้อมูลการวิ่งใหม่
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
