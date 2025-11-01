"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import runIcon from "../../assets/images/run.jpg";
import Footer from "@/components/Footer";

type MyRun = {
  id: string;
  created_at: string;
  run_date: string;
  run_distance: number;
  run_place: string;
  run_image_url: string | null;
};

export default function ShowAllMyRun() {
  const [runs, setRuns] = useState<MyRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRuns = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("myrun_tb")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      alert(error.message);
      setRuns([]);
    } else setRuns(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRuns();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("แน่ใจหรือไม่ว่าจะลบข้อมูลการวิ่งนี้?")) return;
    setDeletingId(id);
    const { error } = await supabase.from("myrun_tb").delete().eq("id", id);
    setDeletingId(null);
    if (error) alert("ลบไม่สำเร็จ: " + error.message);
    else fetchRuns();
  };

  const validUrl = (url: string) => {
    try { new URL(url); return true; } catch { return false; }
  };

  return (
    <>
      <div className="flex flex-col items-center px-4 md:px-10 py-10 bg-gradient-to-b from-blue-100 to-green-100 min-h-screen">
        <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-8 max-w-5xl w-full flex flex-col items-center">
          <Image src={runIcon} alt="วิ่ง" width={150} className="mb-5 rounded-full shadow-md" />
          <h1 className="text-3xl font-bold text-orange-600 mb-6">ข้อมูลการวิ่งทั้งหมด</h1>

          {loading ? (
            <p className="text-gray-600 text-lg">กำลังโหลดข้อมูล...</p>
          ) : runs.length === 0 ? (
            <p className="text-gray-600 text-lg">ยังไม่มีข้อมูลการวิ่ง</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {runs.map((run) => (
                <div
                  key={run.id}
                  className="border rounded-2xl shadow-lg p-4 relative bg-white hover:shadow-2xl transition"
                >
                  {run.run_image_url && validUrl(run.run_image_url) && (
                    <div className="w-full h-40 overflow-hidden rounded-xl mb-3 shadow-md">
                      <Image
                        src={run.run_image_url}
                        alt="รูปการวิ่ง"
                        width={400} 
                        height={160} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p><strong>วันที่:</strong> {run.run_date}</p>
                  <p><strong>ระยะทาง:</strong> {run.run_distance} ม.</p>
                  <p><strong>สถานที่:</strong> {run.run_place}</p>

                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleDelete(run.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition disabled:opacity-50"
                      disabled={deletingId === run.id}
                    >
                      ลบ
                    </button>
                    <Link
                      href={`/create-myrun?id=${run.id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow hover:bg-blue-600 transition"
                    >
                      แก้ไข
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/create-myrun"
            className="mt-6 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-xl shadow hover:from-blue-500 hover:to-green-400 transition transform hover:-translate-y-1"
          >
            ➕ เพิ่มข้อมูลการวิ่งใหม่
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
