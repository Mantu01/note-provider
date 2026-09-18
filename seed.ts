import bcrypt from "bcryptjs";
import { loadEnvFile } from "node:process";

// Load env BEFORE importing prisma so DATABASE_URL is available
loadEnvFile(".env");

const coverImageUrl = "https://res.cloudinary.com/dqznmhhtv/image/upload/v1787432656/notes-provider/covers/thumbnail_ahs7sg.png";
const fullFileUrl = "https://res.cloudinary.com/dqznmhhtv/image/upload/v1787432643/notes-provider/notes/full/vs_resume_xqgl3w.pdf";
const coverImagePublicId = "notes-provider/covers/thumbnail_ahs7sg";
const fullFilePublicId = "notes-provider/notes/full/vs_resume_xqgl3w";
const previewFilePublicId = "notes-provider/notes/preview/vs_resume_xqgl3w";
const seedDate = new Date("2026-01-15T09:00:00.000Z");

async function main() {
  const { prisma } = await import("./src/helpers/db");

  const passwordHash = await bcrypt.hash("Mantu@123", 10);

  const [headAdmin, contentAdmin] = await Promise.all([
    prisma.admin.upsert({
      where: { email: "mantu@gmail.com" },
      update: {},
      create: { name: "Mantu Kumar", email: "mantu@gmail.com", passwordHash, lastLoginAt: new Date("2026-08-20T08:30:00.000Z"), isActive: true, isHead: true, createdAt: new Date("2025-12-01T08:00:00.000Z"), updatedAt: new Date("2026-08-20T08:30:00.000Z") },
    }),
    prisma.admin.upsert({
      where: { email: "aarav@notesprovider.com" },
      update: {},
      create: { name: "Aarav Sharma", email: "aarav@notesprovider.com", passwordHash, lastLoginAt: new Date("2026-08-18T13:45:00.000Z"), isActive: true, isHead: false, createdAt: new Date("2025-12-03T10:00:00.000Z"), updatedAt: new Date("2026-08-18T13:45:00.000Z") },
    }),
  ]);

  const categoriesData = [
    { name: "Web Development", slug: "web-development", description: "Practical frontend and backend notes for building modern web applications.", icon: "globe-2", order: 1, subjects: [{ name: "HTML & CSS", slug: "html-css", order: 1, isActive: true }, { name: "JavaScript", slug: "javascript", order: 2, isActive: true }, { name: "React", slug: "react", order: 3, isActive: true }], createdBy: headAdmin.id, updatedBy: contentAdmin.id, createdAt: seedDate, updatedAt: seedDate },
    { name: "Computer Science", slug: "computer-science", description: "Foundational computer science concepts for study, projects, and interviews.", icon: "cpu", order: 2, subjects: [{ name: "Data Structures", slug: "data-structures", order: 1, isActive: true }, { name: "Algorithms", slug: "algorithms", order: 2, isActive: true }, { name: "DBMS", slug: "dbms", order: 3, isActive: false }], createdBy: headAdmin.id, updatedBy: headAdmin.id, createdAt: new Date("2026-01-16T09:00:00.000Z"), updatedAt: new Date("2026-02-10T09:00:00.000Z") },
    { name: "Interview Preparation", slug: "interview-preparation", description: "Concise preparation material for technical interviews and career growth.", icon: "briefcase-business", order: 3, subjects: [{ name: "System Design", slug: "system-design", order: 1, isActive: true }, { name: "Resume Writing", slug: "resume-writing", order: 2, isActive: true }], createdBy: contentAdmin.id, updatedBy: contentAdmin.id, createdAt: new Date("2026-01-17T09:00:00.000Z"), updatedAt: new Date("2026-03-01T09:00:00.000Z") },
    { name: "Archived Topics", slug: "archived-topics", description: "Inactive sample category retained for testing administrative status filters.", icon: null, order: 4, subjects: [], createdBy: headAdmin.id, updatedBy: headAdmin.id, createdAt: new Date("2026-01-18T09:00:00.000Z"), updatedAt: new Date("2026-01-18T09:00:00.000Z") },
  ];
  const [webCategory, computerCategory, interviewCategory, archivedCategory] = await Promise.all(
    categoriesData.map((c) =>
      prisma.category.upsert({
        where: { slug: c.slug },
        update: {},
        create: c,
      }),
    ),
  );

  const notesData = [
    { ...{ title: "JavaScript Fundamentals", slug: "javascript-fundamentals", description: "A structured guide to JavaScript syntax, functions, objects, arrays, and asynchronous programming.", categoryId: webCategory.id, level: "basics" as const, visibility: "public" as const, pricingType: "free" as const, price: 0, compareAtPrice: null, fullFileUrl, fullFilePublicId, coverImageUrl, coverImagePublicId, fullFileBytes: 2480000, pdfSource: "upload" as const, drivePdfUrl: null, previewFileUrl: null, previewFilePublicId: null, previewFileBytes: null, pageCount: 42, tags: ["javascript", "web-development", "basics"], isFeatured: true, downloadCount: 184, purchaseCount: 0, revenuePaise: 0, createdBy: headAdmin.id, updatedBy: headAdmin.id, createdAt: new Date("2026-02-01T09:00:00.000Z"), updatedAt: new Date("2026-02-05T09:00:00.000Z") } },
    { ...{ title: "React Patterns in Practice", slug: "react-patterns-in-practice", description: "Reusable React patterns covering component composition, state management, effects, and performance.", categoryId: webCategory.id, level: "intermediate" as const, visibility: "public" as const, pricingType: "paid" as const, price: 29900, compareAtPrice: 49900, fullFileUrl, fullFilePublicId, coverImageUrl, coverImagePublicId, fullFileBytes: 4800000, pdfSource: "upload" as const, drivePdfUrl: null, previewFileUrl: fullFileUrl, previewFilePublicId, previewFileBytes: 920000, pageCount: 86, tags: ["react", "frontend", "components", "performance"], isFeatured: true, downloadCount: 96, purchaseCount: 32, revenuePaise: 956800, createdBy: contentAdmin.id, updatedBy: contentAdmin.id, createdAt: new Date("2026-02-04T09:00:00.000Z"), updatedAt: new Date("2026-02-11T09:00:00.000Z") } },
    { ...{ title: "Data Structures and Algorithms", slug: "data-structures-and-algorithms", description: "Interview-ready explanations and problem-solving patterns for essential data structures and algorithms.", categoryId: computerCategory.id, level: "advance" as const, visibility: "public" as const, pricingType: "paid" as const, price: 59900, compareAtPrice: 79900, fullFileUrl, fullFilePublicId, coverImageUrl, coverImagePublicId, fullFileBytes: 7200000, pdfSource: "drive" as const, drivePdfUrl: "https://drive.google.com/file/d/seed-dsa-notes/view", previewFileUrl: fullFileUrl, previewFilePublicId, previewFileBytes: 1200000, pageCount: 156, tags: ["dsa", "algorithms", "interviews", "problem-solving"], isFeatured: false, downloadCount: 71, purchaseCount: 18, revenuePaise: 1078200, createdBy: headAdmin.id, updatedBy: contentAdmin.id, createdAt: new Date("2026-02-08T09:00:00.000Z"), updatedAt: new Date("2026-02-15T09:00:00.000Z") } },
    { ...{ title: "System Design Essentials", slug: "system-design-essentials", description: "A practical introduction to scalable services, APIs, databases, caching, queues, and reliability.", categoryId: interviewCategory.id, level: "advance" as const, visibility: "private" as const, pricingType: "paid" as const, price: 89900, compareAtPrice: null, fullFileUrl, fullFilePublicId, coverImageUrl, coverImagePublicId, fullFileBytes: 9100000, pdfSource: "upload" as const, drivePdfUrl: null, previewFileUrl: fullFileUrl, previewFilePublicId, previewFileBytes: 1500000, pageCount: 204, tags: ["system-design", "backend", "scalability"], isFeatured: false, downloadCount: 12, purchaseCount: 4, revenuePaise: 359600, createdBy: headAdmin.id, updatedBy: headAdmin.id, createdAt: new Date("2026-02-12T09:00:00.000Z"), updatedAt: new Date("2026-02-12T09:00:00.000Z") } },
    { ...{ title: "Resume Writing for Developers", slug: "resume-writing-for-developers", description: "Actionable guidance for writing a clear, measurable, and recruiter-friendly developer resume.", categoryId: interviewCategory.id, level: "basics" as const, visibility: "public" as const, pricingType: "free" as const, price: 0, compareAtPrice: 14900, fullFileUrl, fullFilePublicId, coverImageUrl, coverImagePublicId, fullFileBytes: 1800000, pdfSource: "upload" as const, drivePdfUrl: null, previewFileUrl: null, previewFilePublicId: null, previewFileBytes: null, pageCount: 28, tags: ["resume", "career", "interviews"], isFeatured: false, downloadCount: 211, purchaseCount: 0, revenuePaise: 0, createdBy: contentAdmin.id, updatedBy: contentAdmin.id, createdAt: new Date("2026-02-16T09:00:00.000Z"), updatedAt: new Date("2026-02-16T09:00:00.000Z") } },
    { ...{ title: "Database Design and SQL", slug: "database-design-and-sql", description: "Clear notes on relational modeling, normalization, SQL queries, indexes, and transactions.", categoryId: computerCategory.id, level: "intermediate" as const, visibility: "public" as const, pricingType: "paid" as const, price: 39900, compareAtPrice: 59900, fullFileUrl, fullFilePublicId, coverImageUrl, coverImagePublicId, fullFileBytes: 5300000, pdfSource: "upload" as const, drivePdfUrl: null, previewFileUrl: fullFileUrl, previewFilePublicId, previewFileBytes: 850000, pageCount: 98, tags: ["dbms", "sql", "databases", "backend"], isFeatured: true, downloadCount: 54, purchaseCount: 11, revenuePaise: 438900, createdBy: headAdmin.id, updatedBy: contentAdmin.id, createdAt: new Date("2026-02-20T09:00:00.000Z"), updatedAt: new Date("2026-02-25T09:00:00.000Z") } },
  ];
  const notes = await Promise.all(notesData.map((n) =>
    prisma.note.upsert({
      where: { slug: n.slug },
      update: {},
      create: n,
    }),
  ));

  const groupsData = [
    { name: "Frontend Launch Pack", slug: "frontend-launch-pack", description: "A practical bundle for learning the JavaScript and React skills needed to ship polished frontend projects.", categoryId: webCategory.id, price: 49900, compareAtPrice: 79800, coverImageUrl, coverImagePublicId, visibility: "public" as const, isFeatured: true, purchaseCount: 14, revenuePaise: 698600, createdBy: headAdmin.id, updatedBy: contentAdmin.id, createdAt: new Date("2026-03-01T09:00:00.000Z"), updatedAt: new Date("2026-03-03T09:00:00.000Z") },
    { name: "Interview Accelerator", slug: "interview-accelerator", description: "A focused collection covering algorithms, system design, and developer resume preparation for interviews.", categoryId: interviewCategory.id, price: 129900, compareAtPrice: 149700, coverImageUrl, coverImagePublicId, visibility: "public" as const, isFeatured: false, purchaseCount: 7, revenuePaise: 909300, createdBy: contentAdmin.id, updatedBy: contentAdmin.id, createdAt: new Date("2026-03-05T09:00:00.000Z"), updatedAt: new Date("2026-03-05T09:00:00.000Z") },
    { name: "Private Backend Preview", slug: "private-backend-preview", description: "An unpublished bundle used to test private catalog visibility and administrative editing workflows.", categoryId: computerCategory.id, price: 99900, compareAtPrice: null, coverImageUrl: null, coverImagePublicId: null, visibility: "private" as const, isFeatured: false, purchaseCount: 0, revenuePaise: 0, createdBy: headAdmin.id, updatedBy: headAdmin.id, createdAt: new Date("2026-03-08T09:00:00.000Z"), updatedAt: new Date("2026-03-08T09:00:00.000Z") },
  ];
  const groups = await Promise.all(groupsData.map((g) =>
    prisma.group.upsert({
      where: { slug: g.slug },
      update: {},
      create: g,
    }),
  ));

  await prisma.noteGroup.createMany({
    data: [
      { groupId: groups[0].id, noteId: notes[0].id }, { groupId: groups[0].id, noteId: notes[1].id },
      { groupId: groups[1].id, noteId: notes[2].id }, { groupId: groups[1].id, noteId: notes[3].id }, { groupId: groups[1].id, noteId: notes[4].id },
      { groupId: groups[2].id, noteId: notes[2].id }, { groupId: groups[2].id, noteId: notes[5].id },
    ],
    skipDuplicates: true,
  });

  const makeSnapshot = (title: string, slug: string, price: number, noteIds: string[]) => ({ title, slug, price, noteIds, coverImageUrl });

  const ordersData = [
    { orderNumber: "NP-2026-0001", itemType: "note" as const, noteId: notes[1].id, groupId: null, itemSnapshot: makeSnapshot(notes[1].title, notes[1].slug, notes[1].price, [notes[1].id]), amount: 29900, buyer: { fullName: "Priya Mehta", consentAccepted: true, ipAddress: "203.0.113.11", userAgent: "Mozilla/5.0 Chrome/136" }, razorpayOrderId: "order_seed_paid_0001", razorpayPaymentId: "pay_seed_paid_0001", razorpaySignature: "seed_signature_paid_0001", paymentMethod: "upi", paymentStatus: "paid" as const, fulfillmentStatus: "completed" as const, failureReason: null, adminNote: "Delivered automatically after payment verification.", paidAt: new Date("2026-04-02T10:05:00.000Z"), completedAt: new Date("2026-04-02T10:06:00.000Z"), completedBy: headAdmin.id, createdAt: new Date("2026-04-02T10:04:00.000Z"), updatedAt: new Date("2026-04-02T10:06:00.000Z") },
    { orderNumber: "NP-2026-0002", itemType: "group" as const, noteId: null, groupId: groups[0].id, itemSnapshot: makeSnapshot(groups[0].name, groups[0].slug, groups[0].price, [notes[0].id, notes[1].id]), amount: 49900, buyer: { fullName: "Rohan Verma", consentAccepted: true, ipAddress: null, userAgent: "Mozilla/5.0 Safari/18" }, razorpayOrderId: "order_seed_created_0002", razorpayPaymentId: null, razorpaySignature: null, paymentMethod: null, paymentStatus: "created" as const, fulfillmentStatus: "pending" as const, failureReason: null, adminNote: null, paidAt: null, completedAt: null, completedBy: null, createdAt: new Date("2026-04-04T11:00:00.000Z"), updatedAt: new Date("2026-04-04T11:00:00.000Z") },
    { orderNumber: "NP-2026-0003", itemType: "note" as const, noteId: notes[2].id, groupId: null, itemSnapshot: makeSnapshot(notes[2].title, notes[2].slug, notes[2].price, [notes[2].id]), amount: 59900, buyer: { fullName: "Neha Iyer", consentAccepted: true, ipAddress: "198.51.100.42", userAgent: null }, razorpayOrderId: "order_seed_failed_0003", razorpayPaymentId: null, razorpaySignature: null, paymentMethod: "card", paymentStatus: "failed" as const, fulfillmentStatus: "cancelled" as const, failureReason: "Payment declined by issuing bank.", adminNote: "Customer may retry checkout.", paidAt: null, completedAt: null, completedBy: null, createdAt: new Date("2026-04-06T14:00:00.000Z"), updatedAt: new Date("2026-04-06T14:15:00.000Z") },
    { orderNumber: "NP-2026-0004", itemType: "group" as const, noteId: null, groupId: groups[1].id, itemSnapshot: makeSnapshot(groups[1].name, groups[1].slug, groups[1].price, [notes[2].id, notes[3].id, notes[4].id]), amount: 129900, buyer: { fullName: "Kabir Singh", consentAccepted: false, ipAddress: "192.0.2.88", userAgent: "Mozilla/5.0 Firefox/138" }, razorpayOrderId: "order_seed_pending_0004", razorpayPaymentId: null, razorpaySignature: null, paymentMethod: "netbanking", paymentStatus: "created" as const, fulfillmentStatus: "pending" as const, failureReason: null, adminNote: "Awaiting payment confirmation.", paidAt: null, completedAt: null, completedBy: null, createdAt: new Date("2026-04-08T16:00:00.000Z"), updatedAt: new Date("2026-04-08T16:00:00.000Z") },
    { orderNumber: "NP-2026-0005", itemType: "note" as const, noteId: notes[5].id, groupId: null, itemSnapshot: makeSnapshot(notes[5].title, notes[5].slug, notes[5].price, [notes[5].id]), amount: 39900, buyer: { fullName: "Ananya Rao", consentAccepted: true, ipAddress: "203.0.113.77", userAgent: "Mozilla/5.0 Edge/136" }, razorpayOrderId: "order_seed_cancelled_0005", razorpayPaymentId: "pay_seed_cancelled_0005", razorpaySignature: "seed_signature_cancelled_0005", paymentMethod: "wallet", paymentStatus: "paid" as const, fulfillmentStatus: "cancelled" as const, failureReason: null, adminNote: "Cancelled at customer request before delivery.", paidAt: new Date("2026-04-10T09:00:00.000Z"), completedAt: null, completedBy: null, createdAt: new Date("2026-04-10T08:59:00.000Z"), updatedAt: new Date("2026-04-10T09:30:00.000Z") },
  ];
  await Promise.all(ordersData.map((o) =>
    prisma.order.upsert({
      where: { orderNumber: o.orderNumber },
      update: {},
      create: o,
    }),
  ));

  await Promise.all(["order", "note", "group"].map((key) =>
    prisma.counter.upsert({ where: { key }, update: { seq: 0 }, create: { key, seq: 0 } }),
  ));

  console.log(`Seeded ${await prisma.admin.count()} admins, ${await prisma.category.count()} categories, ${await prisma.note.count()} notes, ${await prisma.group.count()} groups, ${await prisma.order.count()} orders.`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  const { prisma } = await import("./src/helpers/db");
  await prisma.$disconnect();
});
