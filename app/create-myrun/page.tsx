"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import runIcon from "../../assets/images/run.jpg";
import Footer from "@/components/Footer";
import { useSearchParams } from "next/navigation";

export default function CreateMyRun() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id"); // ถ้ามีค่า → แก้ไข
  const [runDate, setRunDate] = useState("");
  const [runDistance, setRunDistance] = useState<number | "">("");
  const [runPlace, setRunPlace] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  // ดึงข้อมูลสำหรับแก้ไข
  useEffect(() => {
    if (editId) {
      const fetchRun = async () => {
        const { data, error } = await supabase
          .from("myrun_tb")
          .select("*")
          .eq("id", editId)
          .single();
        if (error) {
          alert(error.message);
          return;
        }
        if (data) {
          setRunDate(data.run_date);
          setRunDistance(data.run_distance);
          setRunPlace(data.run_place);
          if (data.run_image_url) setImagePreview(data.run_image_url);
        }
      };
      fetchRun();
    }
  }, [editId]);

  const handleSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadAndSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!runDate || !runDistance || !runPlace) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    let imageUrl = imagePreview;

    if (imageFile) {
      const safeName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileName = `${Date.now()}_${safeName}`;
      const { error: uploadError } = await supabase
        .storage.from("myrun_bucket")
        .upload(fileName, imageFile, { upsert: true });
      if (uploadError) {
        alert("เกิดข้อผิดพลาดในการอัปโหลดรูป: " + uploadError.message);
        return;
      }
      const { data: urlData } = supabase.storage.from("myrun_bucket").getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    if (editId) {
      // UPDATE
      const { error: updateError } = await supabase
        .from("myrun_tb")
        .update({
          run_date: runDate,
          run_distance: runDistance,
          run_place: runPlace,
          run_image_url: imageUrl,
        })
        .eq("id", editId);
      if (updateError) {
        alert("แก้ไขไม่สำเร็จ: " + updateError.message);
        return;
      }
      alert("แก้ไขข้อมูลเรียบร้อยแล้ว");
    } else {
      // INSERT
      const { error: insertError } = await supabase.from("myrun_tb").insert({
        run_date: runDate,
        run_distance: runDistance,
        run_place: runPlace,
        run_image_url: imageUrl,
      });
      if (insertError) {
        alert("บันทึกไม่สำเร็จ: " + insertError.message);
        return;
      }
      alert("บันทึกข้อมูลการวิ่งเรียบร้อยแล้ว");
    }

    window.location.href = "/show-all-myrun";
  };

  return (
    <>
      <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-green-100 to-blue-100 py-10">
        <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-8 max-w-md w-full flex flex-col items-center">
          <Image src={runIcon} alt="วิ่ง" width={150} className="mb-5 rounded-full shadow-md" />
          <h1 className="text-2xl font-bold text-orange-600 mb-1">
            {editId ? "แก้ไขการวิ่ง" : "บันทึกการวิ่งใหม่"}
          </h1>
          <h2 className="text-lg text-orange-500 mb-5">
            {editId ? "แก้ไขข้อมูลการวิ่งของคุณ" : "กรอกข้อมูลการวิ่งของคุณ"}
          </h2>

          <form onSubmit={handleUploadAndSave} className="w-full space-y-4">
            <div>
              <label className="block mb-1 font-semibold">วันที่วิ่ง</label>
              <input
                type="text"
                value={runDate}
                onChange={(e) => setRunDate(e.target.value)}
                placeholder="เช่น 19/10/2025"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">ระยะทาง (เมตร)</label>
              <input
                type="number"
                value={runDistance}
                onChange={(e) => setRunDistance(Number(e.target.value))}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">สถานที่วิ่ง</label>
              <input
                type="text"
                value={runPlace}
                onChange={(e) => setRunPlace(e.target.value)}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">อัปโหลดรูป</label>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSelectImage}
              />
              <label
                htmlFor="fileInput"
                className="inline-block bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer font-semibold shadow hover:from-blue-500 hover:to-green-400 transition"
              >
                เลือกรูป
              </label>
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="preview"
                  className="mt-3 max-w-[150px] w-full h-auto rounded-lg shadow"
                  width={150}
                  height={150}
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:from-red-500 hover:to-orange-400 transition transform hover:-translate-y-1"
            >
              {editId ? "บันทึกการแก้ไข" : "บันทึกข้อมูลการวิ่ง"}
            </button>
          </form>

          <Link
            href="/show-all-myrun"
            className="text-blue-500 w-full text-center mt-5 block hover:text-blue-600 font-semibold"
          >
            กลับไปหน้ารายการการวิ่ง
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
