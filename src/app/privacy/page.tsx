import Link from "next/link";
import { lightTheme as theme } from "@/lib/theme";

export const metadata = { title: "นโยบายความเป็นส่วนตัว — English Life" };

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: "'Barlow', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px 60px", overflowWrap: "break-word" }}>
        <Link href="/" style={{ fontSize: 13.5, color: theme.accentDeep, textDecoration: "none", fontWeight: 600 }}>
          ← กลับหน้าหลัก
        </Link>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 28, margin: "18px 0 4px" }}>
          นโยบายความเป็นส่วนตัว
        </h1>
        <p style={{ fontSize: 13, color: theme.muted, marginBottom: 28 }}>ปรับปรุงล่าสุด: กันยายน 2026</p>

        <Section title="ข้อมูลที่เราเก็บ">
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>อีเมลและชื่อที่แสดง (จากตอนสมัครสมาชิก หรือจากบัญชี Google หากเลือกเข้าสู่ระบบด้วย Google)</li>
            <li style={{ wordBreak: "break-word" }}>ผลการประเมินระดับภาษา และระดับทักษะทั้ง 5 ด้าน (Reading, Listening, Writing, Speaking, Understanding)</li>
            <li>ประวัติการฝึกฝน (คำถามที่ตอบ คำตอบที่พิมพ์ คะแนน เวลาที่ใช้) เพื่อคำนวณความก้าวหน้าและปรับความยากให้เหมาะกับคุณ</li>
            <li>การตั้งค่าที่คุณเลือกเอง เช่น ธีมสี เป้าหมายการฝึกต่อวัน</li>
          </ul>
        </Section>

        <Section title="เราใช้ข้อมูลนี้ทำอะไร">
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            ใช้เพื่อแสดงความก้าวหน้าของคุณ ปรับคำถามให้เหมาะกับระดับ และจดจำสิ่งที่คุณฝึกไปแล้วเท่านั้น
            เราไม่ขายหรือแบ่งปันข้อมูลส่วนตัวของคุณให้บุคคลที่สามเพื่อการโฆษณา
          </p>
        </Section>

        <Section title="ที่เก็บข้อมูล">
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            ข้อมูลบัญชีและประวัติการฝึกทั้งหมดเก็บไว้ใน Firebase (Google Cloud) โดยมีกฎการเข้าถึง (Security Rules)
            จำกัดให้เฉพาะเจ้าของบัญชีเท่านั้นที่อ่าน/แก้ไขข้อมูลของตัวเองได้
          </p>
        </Section>

        <Section title="สิทธิ์ของคุณ">
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            คุณสามารถขอให้ลบบัญชีและข้อมูลทั้งหมดของคุณได้ทุกเมื่อ โดยติดต่อผู้ดูแลแอปโดยตรง
          </p>
        </Section>

        <Section title="บริการภายนอกที่ใช้">
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            Firebase Authentication (รวมถึง Google Sign-In หากเลือกใช้) และ Firebase Firestore สำหรับเก็บข้อมูล
            แอปนี้ไม่มีระบบโฆษณาหรือระบบวิเคราะห์พฤติกรรมจากบุคคลที่สามติดตั้งอยู่
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 18, margin: "0 0 8px" }}>{title}</h2>
      <div style={{ fontSize: 14.5 }}>{children}</div>
    </div>
  );
}
