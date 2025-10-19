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
    const { data, error } = await supabase.from("myrun_tb").select("*").order("created_at", { ascending: false });
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
      <div className="flex flex-col items-center px-4 md:px-10 py-10 bg-gray-50 min-h-screen">
        <div className="bg-white border border-gray-300 shadow-lg rounded-xl p-8 max-w-4xl w-full flex flex-col items-center">
          <Image src={runIcon} alt="Run" width={150} className="mb-5" />
          <h1 className="text-2xl font-bold text-red-700 mb-3">ข้อมูลการวิ่งทั้งหมด</h1>

          {loading ? (
            <p>กำลังโหลดข้อมูล...</p>
          ) : runs.length === 0 ? (
            <p>ยังไม่มีข้อมูลการวิ่ง</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {runs.map((run) => (
                <div key={run.id} className="border p-4 rounded shadow relative">
                  {run.run_image_url && validUrl(run.run_image_url) && (
                    <Image src={run.run_image_url} alt="run" width={200} height={150} className="rounded mb-2" />
                  )}
                  <p><strong>วันที่:</strong> {run.run_date}</p>
                  <p><strong>ระยะทาง:</strong> {run.run_distance} ม.</p>
                  <p><strong>สถานที่:</strong> {run.run_place}</p>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleDelete(run.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      disabled={deletingId === run.id}
                    >
                      ลบ
                    </button>
                    <Link
                      href={`/create-myrun?id=${run.id}`}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
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
            className="text-blue-500 mt-5 hover:text-blue-600"
          >
            ➕ เพิ่มข้อมูลการวิ่งใหม่
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
