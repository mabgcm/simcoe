import type { AppLocale } from "@/i18n/config";

type Localized = Record<AppLocale, string>;

function pick(value: Localized, locale: string) {
  return value[locale === "en" ? "en" : "tr"];
}

const newsSource = [
  {
    id: "1",
    title: { tr: "Simcoe Türk topluluğu bahar buluşmasında bir araya geldi", en: "Simcoe Turkish community gathered for the spring meetup" },
    slug: "bahar-bulusmasi",
    excerpt: {
      tr: "Aileler, gönüllüler ve yeni gelen üyeler kültürel program ve dayanışma kahvaltısında buluştu.",
      en: "Families, volunteers and newcomers met for a cultural program and community breakfast."
    },
    body: {
      tr: "<p>Simcoe County Turkish Association bahar buluşması, bölgedeki aileleri ve yeni gelen üyeleri aynı masada bir araya getirdi.</p><p>Programda çocuk etkinlikleri, gönüllü tanışmaları ve yaklaşan projeler için kısa bilgilendirmeler yer aldı.</p><p>Yönetim ekibi, 2026 takviminin kültürel etkinlikler ve rehberlik çalışmalarıyla genişleyeceğini paylaştı.</p>",
      en: "<p>The Simcoe County Turkish Association spring meetup brought local families and newcomers together around one table.</p><p>The program included children's activities, volunteer introductions and short updates on upcoming projects.</p><p>The board shared that the 2026 calendar will expand with cultural events and newcomer support programs.</p>"
    },
    category: { tr: "Topluluk", en: "Community" },
    coverImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date("2026-04-22"),
    author: { tr: "STA Yönetimi", en: "STA Board" },
    readMinutes: 3
  },
  {
    id: "2",
    title: { tr: "Yeni gelenler için sağlık sistemi rehberi yayınlandı", en: "Health system guide published for newcomers" },
    slug: "saglik-sistemi-rehberi",
    excerpt: {
      tr: "Ontario sağlık kartı, aile hekimi bulma ve acil olmayan sağlık hizmetleri için pratik adımlar.",
      en: "Practical steps for OHIP, finding a family doctor and accessing non-emergency health services."
    },
    body: {
      tr: "<p>Rehber, Ontario sağlık sistemine ilk kez dahil olan aileler için sade bir başlangıç noktası sunar.</p><p>OHIP başvurusu, walk-in clinic kullanımı ve aile hekimi arama süreçleri adım adım özetlenmiştir.</p><p>İçerik düzenli olarak güncellenerek resmi kaynaklara bağlantılarla desteklenecektir.</p>",
      en: "<p>The guide offers a clear starting point for families using the Ontario health system for the first time.</p><p>OHIP applications, walk-in clinic use and family doctor search steps are summarized in plain language.</p><p>The content will be updated regularly with links to official resources.</p>"
    },
    category: { tr: "Rehber", en: "Guide" },
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date("2026-04-10"),
    author: { tr: "Yeni Gelenler Ekibi", en: "Newcomers Team" },
    readMinutes: 5
  },
  {
    id: "3",
    title: { tr: "Gençlik gönüllü programı başvuruları açıldı", en: "Youth volunteer program applications are open" },
    slug: "genclik-gonullu-programi",
    excerpt: {
      tr: "Lise ve üniversite öğrencileri etkinlik organizasyonu ve toplum hizmeti saatleri için programa katılabilir.",
      en: "High school and university students can join for event support and community service hours."
    },
    body: {
      tr: "<p>Program, gençlerin topluluk çalışmalarında sorumluluk almasını ve deneyim kazanmasını hedefler.</p><p>Katılımcılar etkinlik hazırlığı, kayıt masası, sosyal medya desteği ve rehberlik çalışmalarına katkı sunabilir.</p><p>Başvurular gönüllü koordinasyon ekibi tarafından değerlendirilecektir.</p>",
      en: "<p>The program helps youth take responsibility in community work and gain practical experience.</p><p>Participants can support event setup, registration desks, social media and newcomer guidance projects.</p><p>Applications will be reviewed by the volunteer coordination team.</p>"
    },
    category: { tr: "Gönüllülük", en: "Volunteering" },
    coverImage: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date("2026-03-28"),
    author: { tr: "Gönüllü Koordinasyonu", en: "Volunteer Coordination" },
    readMinutes: 4
  }
];

const eventSource = [
  {
    id: "1",
    title: { tr: "19 Mayıs Gençlik ve Spor Buluşması", en: "May 19 Youth and Sports Gathering" },
    slug: "19-mayis-bulusmasi",
    location: "Barrie Community Centre",
    address: "Barrie, ON",
    startDate: new Date("2026-05-19T18:30:00"),
    endDate: new Date("2026-05-19T21:00:00"),
    coverImage: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
    category: { tr: "Kültür", en: "Culture" },
    price: 0,
    capacity: 120
  },
  {
    id: "2",
    title: { tr: "Yeni Gelenler Networking Akşamı", en: "Newcomers Networking Night" },
    slug: "newcomers-networking",
    location: "Innisfil Library",
    address: "Innisfil, ON",
    startDate: new Date("2026-06-07T17:00:00"),
    endDate: new Date("2026-06-07T19:30:00"),
    coverImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    category: { tr: "Destek", en: "Support" },
    price: 10,
    capacity: 60
  },
  {
    id: "3",
    title: { tr: "Aile Pikniği ve Sponsor Tanışması", en: "Family Picnic and Sponsor Meetup" },
    slug: "aile-piknigi",
    location: "Centennial Park",
    address: "Barrie, ON",
    startDate: new Date("2026-07-12T11:00:00"),
    endDate: new Date("2026-07-12T16:00:00"),
    coverImage: "https://images.unsplash.com/photo-1472653816316-3ad6f10a6592?auto=format&fit=crop&w=1200&q=80",
    category: { tr: "Aile", en: "Family" },
    price: 0,
    capacity: null
  }
];

const guideSource = [
  { id: "housing", category: "housing", title: { tr: "Konut ve kira süreci", en: "Housing and rentals" }, slug: "konut-ve-kira", content: { tr: "Kira başvurusu, referans hazırlığı ve temel haklar için kontrol listesi.", en: "A checklist for rental applications, references and basic tenant rights." }, order: 1 },
  { id: "health", category: "health", title: { tr: "Ontario sağlık sistemi", en: "Ontario health system" }, slug: "ontario-saglik", content: { tr: "OHIP başvurusu, walk-in clinic ve aile hekimi seçenekleri.", en: "OHIP applications, walk-in clinics and family doctor options." }, order: 2 },
  { id: "education", category: "education", title: { tr: "Okul kayıtları", en: "School registration" }, slug: "okul-kayitlari", content: { tr: "Çocuklar için okul bölgesi, kayıt belgeleri ve dil destekleri.", en: "School boundaries, registration documents and language support for children." }, order: 3 },
  { id: "employment", category: "employment", title: { tr: "İş arama başlangıcı", en: "Starting a job search" }, slug: "is-arama", content: { tr: "Kanada formatında CV, LinkedIn ve yerel iş kaynakları.", en: "Canadian-style resumes, LinkedIn and local employment resources." }, order: 4 },
  { id: "culture", category: "culture", title: { tr: "Kültürel uyum", en: "Cultural adjustment" }, slug: "kulturel-uyum", content: { tr: "Günlük yaşam, topluluk etkinlikleri ve gönüllülük fırsatları.", en: "Daily life, community events and volunteer opportunities." }, order: 5 },
  { id: "legal", category: "legal", title: { tr: "Temel hukuki kaynaklar", en: "Basic legal resources" }, slug: "hukuki-kaynaklar", content: { tr: "Ücretsiz danışmanlık kanalları ve resmi bilgi kaynakları.", en: "Free advice channels and official information resources." }, order: 6 }
] as const;

export function getNews(locale: string) {
  return newsSource.map((item) => ({
    ...item,
    title: pick(item.title, locale),
    excerpt: pick(item.excerpt, locale),
    body: pick(item.body, locale),
    category: pick(item.category, locale),
    author: pick(item.author, locale)
  }));
}

export function getEvents(locale: string) {
  return eventSource.map((item) => ({ ...item, title: pick(item.title, locale), category: pick(item.category, locale) }));
}

export function getGuideEntries(locale: string) {
  return guideSource.map((item) => ({ ...item, title: pick(item.title, locale), content: pick(item.content, locale), language: locale === "en" ? "en" : "tr" }));
}

export const sponsors = [
  { id: "1", name: "Anatolia Market", tier: "Gold", logoUrl: "https://ui-avatars.com/api/?name=Anatolia+Market&background=C0392B&color=fff&size=256", websiteUrl: "https://example.com" },
  { id: "2", name: "Simcoe Legal Clinic", tier: "Silver", logoUrl: "https://ui-avatars.com/api/?name=Simcoe+Legal&background=1A1A2E&color=fff&size=256", websiteUrl: "https://example.com" },
  { id: "3", name: "Maple Homes", tier: "Bronze", logoUrl: "https://ui-avatars.com/api/?name=Maple+Homes&background=F39C12&color=1A1A2E&size=256", websiteUrl: "https://example.com" },
  { id: "4", name: "Barrie Dental", tier: "Silver", logoUrl: "https://ui-avatars.com/api/?name=Barrie+Dental&background=7F8C8D&color=fff&size=256", websiteUrl: "https://example.com" }
];

export const galleryImages = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1472653816316-3ad6f10a6592?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80"
];

export const boardMembers = [
  { name: "Ayşe Demir", role: { tr: "Başkan", en: "President" }, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80" },
  { name: "Mehmet Kaya", role: { tr: "Başkan Yardımcısı", en: "Vice President" }, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" },
  { name: "Elif Yılmaz", role: { tr: "Sekreter", en: "Secretary" }, photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80" },
  { name: "Can Arslan", role: { tr: "Sayman", en: "Treasurer" }, photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80" }
].map((member) => ({
  ...member,
  getRole(locale: string) {
    return pick(member.role, locale);
  }
}));
