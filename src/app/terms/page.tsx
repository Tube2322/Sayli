import Link from "next/link";
import { lightTheme as theme } from "@/lib/theme";

export const metadata = { title: "ข้อตกลงการใช้งาน — English Life" };

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: "'Barlow', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px 60px", overflowWrap: "break-word" }}>
        <Link href="/" style={{ fontSize: 13.5, color: theme.accentDeep, textDecoration: "none", fontWeight: 600 }}>
          ← กลับหน้าหลัก
        </Link>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 28, margin: "18px 0 4px" }}>
          ข้อตกลงการใช้งาน
        </h1>
        <p style={{ fontSize: 13, color: theme.muted, marginBottom: 28 }}>ปรับปรุงล่าสุด: กันยายน 2026</p>

        <Section title="เกี่ยวกับแอปนี้">
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            English Life เป็นแอปฝึกภาษาอังกฤษส่วนบุคคล ให้บริการฟรี ไม่มีค่าใช้จ่ายใดๆ
          </p>
        </Section>

        <Section title="การใช้งาน">
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>คุณต้องมีอายุที่เหมาะสมตามกฎหมายท้องถิ่นในการสร้างบัญชีอีเมล</li>
            <li>ห้ามใช้บัญชีผู้อื่นโดยไม่ได้รับอนุญาต</li>
            <li>เนื้อหาบางส่วนดัดแปลงมาจากฐานข้อมูลประโยคสาธารณะ Tatoeba.org (สัญญาอนุญาต CC BY) — เครดิตผู้แต่งประโยคอยู่ในข้อมูลของแต่ละคำถาม</li>
          </ul>
        </Section>

        <Section title="ข้อจำกัดความรับผิดชอบ">
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            แอปนี้ยังอยู่ระหว่างการพัฒนา คะแนน/ระดับที่ประเมินให้เป็นการประมาณการจากการฝึกจริงของคุณ ไม่ใช่ใบรับรองภาษาอย่างเป็นทางการ
            เราพยายามรักษาระบบให้ทำงานได้ต่อเนื่อง แต่ไม่รับประกันว่าจะไม่มีข้อผิดพลาดหรือการหยุดชะงักเลย
          </p>
        </Section>

        <Section title="การเปลี่ยนแปลง">
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            เราอาจปรับปรุงฟีเจอร์หรือข้อตกลงนี้ได้ตลอดเวลาเพื่อพัฒนาแอปให้ดีขึ้น
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
