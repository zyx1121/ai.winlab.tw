import { Mail, Phone } from "lucide-react";

export function HomeContacts() {
  return (
    <div className="bg-foreground text-background py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">聯絡我們</h2>
          <p className="text-background/70 text-lg">想知道更多的資訊或是有疑問，歡迎透過以下方式聯繫</p>
        </div>
        <div className="flex flex-col gap-4 shrink-0">
          <p className="text-lg font-semibold">陳心詠</p>
          <div className="flex items-center gap-3 text-background/80">
            <Phone className="w-4 h-4 shrink-0" />
            <a href="tel:03-5131867" className="hover:text-background transition-colors">54832</a>
          </div>
          <div className="flex items-center gap-3 text-background/80">
            <Mail className="w-4 h-4 shrink-0" />
            <a href="mailto:hsinyungchen@nycu.edu.tw" className="hover:text-background transition-colors">
              hsinyungchen@nycu.edu.tw
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
