import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const wells = [
  { number: 1, name: "PUITS N°01", village: "Paki", commune: "Malicounda", department: "Mbour", region: "Thiès", note: "Travaux inachevés", lat: 14.48, lng: -16.93 },
  { number: 2, name: "PUITS N°02", village: "Singar", commune: "Toubacouta", department: "Foundiougne", region: "Fatick", lat: 13.78, lng: -16.48 },
  { number: 3, name: "PUITS N°03", village: "Ngouye", commune: "Nioro Alassane Tall", department: "Foundiougne", region: "Fatick", lat: 13.78, lng: -16.34 },
  { number: 4, name: "PUITS N°04", village: "Djiby Amadou Deh", commune: "Bokhol", department: "Dagana", region: "Saint-Louis", lat: 16.52, lng: -15.5 },
  { number: 5, name: "PUITS N°05", village: "Ibra Ndour", department: "Birkelane", region: "Kaffrine", lat: 14.09, lng: -15.55 },
  { number: 6, name: "PUITS N°06", village: "Keur Mbaye", department: "Dagana", region: "Saint-Louis", lat: 16.4, lng: -15.5 },
  { number: 7, name: "PUITS N°07", village: "Dabane Ogo", commune: "Keur Socé", region: "Kaolack", lat: 13.98, lng: -16.06 },
  { number: 8, name: "PUITS N°08", village: "Keur Mbaye", commune: "Bokhol", department: "Dagana", region: "Saint-Louis", lat: 16.52, lng: -15.5 },
  { number: 9, name: "PUITS N°09", commune: "Guéoul", department: "Kébémer", region: "Louga", lat: 15.47, lng: -16.34 },
  { number: 10, name: "PUITS N°10", village: "Bakk Séd", commune: "Fissel-Mbadane", region: "Thiès", lat: 14.54, lng: -16.61 },
  { number: 11, name: "PUITS N°11", village: "Thiouthioune Mbalème", commune: "Thiadiaye Ndialgui", arrondissement: "Ndiob", department: "Fatick", region: "Fatick", lat: 14.28, lng: -16.4 },
  { number: 12, name: "PUITS N°12", village: "Bak", commune: "Fissel-Mbadane", department: "Mbour", region: "Thiès", lat: 14.54, lng: -16.61 },
  { number: 13, name: "PUITS N°13", village: "Thiamène Samba Ramata", commune: "Keur Socé", arrondissement: "Ndiédieng", department: "Kaolack", region: "Kaolack", lat: 13.98, lng: -16.06 },
  { number: 14, name: "PUITS N°14", village: "Alassane Deh", commune: "Bokhol", department: "Dagana", region: "Saint-Louis", lat: 16.52, lng: -15.5 },
  { number: 15, name: "FORAGE N°15", village: "Doudou Fall", commune: "Mbane", department: "Dagana", region: "Saint-Louis", lat: 16.29, lng: -15.38, category: "Mini_forage" as const },
  { number: 16, name: "PUITS N°16", village: "Ndiaye", commune: "Léona", department: "Louga", region: "Louga", lat: 15.61, lng: -16.22 },
  { number: 17, name: "PUITS N°17", village: "Saré Pathé", commune: "Ngathie Naoudé", department: "Birkelane", region: "Kaffrine", lat: 14.09, lng: -15.55 },
  { number: 18, name: "PUITS N°18", village: "Dow 2", region: "Louga", lat: 15.61, lng: -16.22 },
  { number: 19, name: "PUITS N°19", village: "Noreyni", commune: "Léona", department: "Louga", region: "Louga", lat: 15.61, lng: -16.22 },
  { number: 20, name: "PUITS N°20", village: "Mbelwèmec", commune: "Fissel-Mbadane", department: "Mbour", region: "Thiès", lat: 14.54, lng: -16.61 },
  { number: 21, name: "PUITS N°21", village: "Diock", arrondissement: "Ndiob", region: "Fatick", lat: 14.28, lng: -16.4 },
  { number: 22, name: "PUITS N°22", village: "Ndiayène Cassasse", commune: "Ngathie Naoudé", region: "Kaffrine", lat: 14.09, lng: -15.55 },
  { number: 23, name: "PUITS N°23", village: "Keur Moumine", commune: "Ndiaffate", department: "Kaolack", region: "Kaolack", lat: 14.11, lng: -16.08 },
  { number: 24, name: "PUITS N°24", village: "Toucouleur Diéry", commune: "Bokhol", department: "Dagana", region: "Saint-Louis", lat: 16.52, lng: -15.5 },
  { number: 25, name: "PUITS N°25", village: "Keur Mbaye Peulh", commune: "Bokhol", department: "Dagana", region: "Saint-Louis", lat: 16.52, lng: -15.5 },
  { number: 26, name: "PUITS N°26", village: "Dara Halébé", commune: "Dodel", arrondissement: "Gamadji Sarr", department: "Podor", region: "Saint-Louis", lat: 16.9, lng: -14.96 },
  { number: 27, name: "PUITS N°27", village: "Diongto", commune: "Dabia", region: "Matam", lat: 15.3, lng: -13.25 },
  { number: 28, name: "PUITS N°28", village: "Dégou Niaye", commune: "Ndiébène Gandiol", arrondissement: "Rao", department: "Saint-Louis", region: "Saint-Louis", lat: 16.08, lng: -16.46 },
];

async function main() {
  for (const w of wells) {
    const category = (w as { category?: "Mini_forage" }).category;
    const locationParts = [w.village, w.commune, (w as { arrondissement?: string }).arrondissement, w.department, w.region].filter(Boolean);

    await prisma.achievement.upsert({
      where: { number: w.number },
      create: {
        number: w.number,
        name: w.name,
        category: category ?? "Puits",
        village: w.village ?? null,
        commune: w.commune ?? null,
        arrondissement: (w as { arrondissement?: string }).arrondissement ?? null,
        department: w.department ?? null,
        region: w.region,
        lat: w.lat,
        lng: w.lng,
        note: w.note ?? null,
        location: locationParts.join(", "),
        photos: "[]",
      },
      update: {
        name: w.name,
        category: category ?? "Puits",
        village: w.village ?? null,
        commune: w.commune ?? null,
        arrondissement: (w as { arrondissement?: string }).arrondissement ?? null,
        department: w.department ?? null,
        region: w.region,
        lat: w.lat,
        lng: w.lng,
        note: w.note ?? null,
        location: locationParts.join(", "),
      },
    });
  }

  const defaultSettings: Record<string, string> = {
    whatsapp_main: "https://wa.me/221786347307",
    whatsapp_group_1: "https://whatsapp.com/channel/0029Vb5KlXaEgGfRrY7rpp3P",
    whatsapp_group_2: "",
    whatsapp_group_3: "",
    contact_email: "missionmisericorde2025@gmail.com",
    social_facebook: "",
    social_instagram: "",
    social_youtube: "",
    social_tiktok: "",
    payment_methods:
      [
        "Wave + Orange Money : +221 78 634 73 07",
        "Wave + Orange Money : +221 78 750 85 91",
        "Bénéficiaire : Mohammad Nazir",
        "PayPal : magendey@gmail.com",
        "Virement ou remise de chèque : contactez-nous.",
      ].join("\n"),
    payment_security:
      "Les paiements sont traités via des prestataires reconnus. Les informations de don sont protégées et les montants suivis en toute transparence.",
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  const adminEmail = "admin@mission-misericorde.org";
  await prisma.user.upsert({
    where: { email: adminEmail },
    create: { email: adminEmail, name: "Admin" },
    update: {},
  });

  console.log("Seed done: achievements + settings + admin");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
