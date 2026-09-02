import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { loadEnvFile } from "node:process";
import { connectDB } from "./src/server/db/connect";
import { AdminActivity } from "./src/server/db/models/admin-activity.model";
import { Admin } from "./src/server/db/models/admin.model";
import { Category } from "./src/server/db/models/category.model";
import { Counter } from "./src/server/db/models/counter.model";
import { Group } from "./src/server/db/models/group.model";
import { Note } from "./src/server/db/models/note.model";
import { Order } from "./src/server/db/models/order.model";

const coverImageUrl = "https://res.cloudinary.com/dqznmhhtv/image/upload/v1787432656/notes-provider/covers/thumbnail_ahs7sg.png";
const fullFileUrl = "https://res.cloudinary.com/dqznmhhtv/image/upload/v1787432643/notes-provider/notes/full/vs_resume_xqgl3w.pdf";
const coverImagePublicId = "notes-provider/covers/thumbnail_ahs7sg";
const fullFilePublicId = "notes-provider/notes/full/vs_resume_xqgl3w";
const previewFilePublicId = "notes-provider/notes/preview/vs_resume_xqgl3w";
const seedDate = new Date("2026-01-15T09:00:00.000Z");

loadEnvFile(".env");

async function seed() {
  await connectDB();

  await Promise.all([
    AdminActivity.deleteMany({}), Order.deleteMany({}), Group.deleteMany({}), Note.deleteMany({}),
    Category.deleteMany({}), Counter.deleteMany({}), Admin.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash("Mantu@123", 10);
  const [headAdmin, contentAdmin] = await Admin.insertMany([
    {
      name: "Mantu Kumar", email: "mantu@gmail.com", passwordHash,
      lastLoginAt: new Date("2026-08-20T08:30:00.000Z"), isActive: true, isHead: true,
      createdAt: new Date("2025-12-01T08:00:00.000Z"), updatedAt: new Date("2026-08-20T08:30:00.000Z"),
    },
    {
      name: "Aarav Sharma", email: "aarav@notesprovider.com", passwordHash,
      lastLoginAt: new Date("2026-08-18T13:45:00.000Z"), isActive: true, isHead: false,
      createdAt: new Date("2025-12-03T10:00:00.000Z"), updatedAt: new Date("2026-08-18T13:45:00.000Z"),
    },
    {
      name: "Retired Editor", email: "retired@notesprovider.com", passwordHash,
      lastLoginAt: null, isActive: false, isHead: false,
      createdAt: new Date("2025-12-05T10:00:00.000Z"), updatedAt: new Date("2026-02-01T10:00:00.000Z"),
    },
  ]);

  const [webCategory, computerCategory, interviewCategory, archivedCategory] = await Category.insertMany([
    {
      name: "Web Development", slug: "web-development", description: "Practical frontend and backend notes for building modern web applications.", icon: "globe-2", order: 1, isActive: true,
      subjects: [
        { name: "HTML & CSS", slug: "html-css", order: 1, isActive: true },
        { name: "JavaScript", slug: "javascript", order: 2, isActive: true },
        { name: "React", slug: "react", order: 3, isActive: true },
      ],
      createdBy: headAdmin._id, updatedBy: contentAdmin._id, createdAt: seedDate, updatedAt: seedDate,
    },
    {
      name: "Computer Science", slug: "computer-science", description: "Foundational computer science concepts for study, projects, and interviews.", icon: "cpu", order: 2, isActive: true,
      subjects: [
        { name: "Data Structures", slug: "data-structures", order: 1, isActive: true },
        { name: "Algorithms", slug: "algorithms", order: 2, isActive: true },
        { name: "DBMS", slug: "dbms", order: 3, isActive: false },
      ],
      createdBy: headAdmin._id, updatedBy: headAdmin._id, createdAt: new Date("2026-01-16T09:00:00.000Z"), updatedAt: new Date("2026-02-10T09:00:00.000Z"),
    },
    {
      name: "Interview Preparation", slug: "interview-preparation", description: "Concise preparation material for technical interviews and career growth.", icon: "briefcase-business", order: 3, isActive: true,
      subjects: [
        { name: "System Design", slug: "system-design", order: 1, isActive: true },
        { name: "Resume Writing", slug: "resume-writing", order: 2, isActive: true },
      ],
      createdBy: contentAdmin._id, updatedBy: contentAdmin._id, createdAt: new Date("2026-01-17T09:00:00.000Z"), updatedAt: new Date("2026-03-01T09:00:00.000Z"),
    },
    {
      name: "Archived Topics", slug: "archived-topics", description: "Inactive sample category retained for testing administrative status filters.", icon: null, order: 4, isActive: false,
      subjects: [], createdBy: headAdmin._id, updatedBy: headAdmin._id, createdAt: new Date("2026-01-18T09:00:00.000Z"), updatedAt: new Date("2026-01-18T09:00:00.000Z"),
    },
  ]);

  const noteDefaults = {
    fullFileUrl, fullFilePublicId, coverImageUrl, coverImagePublicId,
  };
  const notes = await Note.insertMany([
    {
      ...noteDefaults, title: "JavaScript Fundamentals", slug: "javascript-fundamentals", description: "A structured guide to JavaScript syntax, functions, objects, arrays, and asynchronous programming.", category: webCategory._id, level: "basics", visibility: "public", pricingType: "free", price: 0, compareAtPrice: null,
      fullFileBytes: 2480000, pdfSource: "upload", drivePdfUrl: null, previewFileUrl: null, previewFilePublicId: null, previewFileBytes: null, pageCount: 42, tags: ["javascript", "web-development", "basics"], isFeatured: true, downloadCount: 184, purchaseCount: 0, revenuePaise: 0, createdBy: headAdmin._id, updatedBy: headAdmin._id, createdAt: new Date("2026-02-01T09:00:00.000Z"), updatedAt: new Date("2026-02-05T09:00:00.000Z"),
    },
    {
      ...noteDefaults, title: "React Patterns in Practice", slug: "react-patterns-in-practice", description: "Reusable React patterns covering component composition, state management, effects, and performance.", category: webCategory._id, level: "intermediate", visibility: "public", pricingType: "paid", price: 299, compareAtPrice: 499,
      fullFileBytes: 4800000, pdfSource: "upload", drivePdfUrl: null, previewFileUrl: fullFileUrl, previewFilePublicId, previewFileBytes: 920000, pageCount: 86, tags: ["react", "frontend", "components", "performance"], isFeatured: true, downloadCount: 96, purchaseCount: 32, revenuePaise: 956800, createdBy: contentAdmin._id, updatedBy: contentAdmin._id, createdAt: new Date("2026-02-04T09:00:00.000Z"), updatedAt: new Date("2026-02-11T09:00:00.000Z"),
    },
    {
      ...noteDefaults, title: "Data Structures and Algorithms", slug: "data-structures-and-algorithms", description: "Interview-ready explanations and problem-solving patterns for essential data structures and algorithms.", category: computerCategory._id, level: "advance", visibility: "public", pricingType: "paid", price: 599, compareAtPrice: 799,
      fullFileBytes: 7200000, pdfSource: "drive", drivePdfUrl: "https://drive.google.com/file/d/seed-dsa-notes/view", previewFileUrl: fullFileUrl, previewFilePublicId, previewFileBytes: 1200000, pageCount: 156, tags: ["dsa", "algorithms", "interviews", "problem-solving"], isFeatured: false, downloadCount: 71, purchaseCount: 18, revenuePaise: 1078200, createdBy: headAdmin._id, updatedBy: contentAdmin._id, createdAt: new Date("2026-02-08T09:00:00.000Z"), updatedAt: new Date("2026-02-15T09:00:00.000Z"),
    },
    {
      ...noteDefaults, title: "System Design Essentials", slug: "system-design-essentials", description: "A practical introduction to scalable services, APIs, databases, caching, queues, and reliability.", category: interviewCategory._id, level: "advance", visibility: "private", pricingType: "paid", price: 899, compareAtPrice: null,
      fullFileBytes: 9100000, pdfSource: "upload", drivePdfUrl: null, previewFileUrl: fullFileUrl, previewFilePublicId, previewFileBytes: 1500000, pageCount: 204, tags: ["system-design", "backend", "scalability"], isFeatured: false, downloadCount: 12, purchaseCount: 4, revenuePaise: 359600, createdBy: headAdmin._id, updatedBy: headAdmin._id, createdAt: new Date("2026-02-12T09:00:00.000Z"), updatedAt: new Date("2026-02-12T09:00:00.000Z"),
    },
    {
      ...noteDefaults, title: "Resume Writing for Developers", slug: "resume-writing-for-developers", description: "Actionable guidance for writing a clear, measurable, and recruiter-friendly developer resume.", category: interviewCategory._id, level: "basics", visibility: "public", pricingType: "free", price: 0, compareAtPrice: 149,
      fullFileBytes: 1800000, pdfSource: "upload", drivePdfUrl: null, previewFileUrl: null, previewFilePublicId: null, previewFileBytes: null, pageCount: 28, tags: ["resume", "career", "interviews"], isFeatured: false, downloadCount: 211, purchaseCount: 0, revenuePaise: 0, createdBy: contentAdmin._id, updatedBy: contentAdmin._id, createdAt: new Date("2026-02-16T09:00:00.000Z"), updatedAt: new Date("2026-02-16T09:00:00.000Z"),
    },
    {
      ...noteDefaults, title: "Database Design and SQL", slug: "database-design-and-sql", description: "Clear notes on relational modeling, normalization, SQL queries, indexes, and transactions.", category: computerCategory._id, level: "intermediate", visibility: "public", pricingType: "paid", price: 399, compareAtPrice: 599,
      fullFileBytes: 5300000, pdfSource: "upload", drivePdfUrl: null, previewFileUrl: fullFileUrl, previewFilePublicId, previewFileBytes: 850000, pageCount: 98, tags: ["dbms", "sql", "databases", "backend"], isFeatured: true, downloadCount: 54, purchaseCount: 11, revenuePaise: 438900, createdBy: headAdmin._id, updatedBy: contentAdmin._id, createdAt: new Date("2026-02-20T09:00:00.000Z"), updatedAt: new Date("2026-02-25T09:00:00.000Z"),
    },
  ]);

  const [frontendGroup, interviewGroup, privateGroup] = await Group.insertMany([
    {
      name: "Frontend Launch Pack", slug: "frontend-launch-pack", description: "A practical bundle for learning the JavaScript and React skills needed to ship polished frontend projects.", category: webCategory._id, price: 499, compareAtPrice: 798, notes: [notes[0]._id, notes[1]._id], coverImageUrl, coverImagePublicId, visibility: "public", isFeatured: true, purchaseCount: 14, revenuePaise: 698600, createdBy: headAdmin._id, updatedBy: contentAdmin._id, createdAt: new Date("2026-03-01T09:00:00.000Z"), updatedAt: new Date("2026-03-03T09:00:00.000Z"),
    },
    {
      name: "Interview Accelerator", slug: "interview-accelerator", description: "A focused collection covering algorithms, system design, and developer resume preparation for interviews.", category: interviewCategory._id, price: 1299, compareAtPrice: 1497, notes: [notes[2]._id, notes[3]._id, notes[4]._id], coverImageUrl, coverImagePublicId, visibility: "public", isFeatured: false, purchaseCount: 7, revenuePaise: 909300, createdBy: contentAdmin._id, updatedBy: contentAdmin._id, createdAt: new Date("2026-03-05T09:00:00.000Z"), updatedAt: new Date("2026-03-05T09:00:00.000Z"),
    },
    {
      name: "Private Backend Preview", slug: "private-backend-preview", description: "An unpublished bundle used to test private catalog visibility and administrative editing workflows.", category: computerCategory._id, price: 999, compareAtPrice: null, notes: [notes[2]._id, notes[5]._id], coverImageUrl: null, coverImagePublicId: null, visibility: "private", isFeatured: false, purchaseCount: 0, revenuePaise: 0, createdBy: headAdmin._id, updatedBy: headAdmin._id, createdAt: new Date("2026-03-08T09:00:00.000Z"), updatedAt: new Date("2026-03-08T09:00:00.000Z"),
    },
  ]);

  const itemSnapshot = (title: string, slug: string, price: number, noteIds: string[], cover = coverImageUrl) => ({ title, slug, price, noteIds, coverImageUrl: cover });
  await Order.insertMany([
    {
      orderNumber: "NP-2026-0001", itemType: "note", note: String(notes[1]._id), group: null, itemSnapshot: itemSnapshot(notes[1].title, notes[1].slug, notes[1].price, [String(notes[1]._id)]), amount: 29900, currency: "INR", buyer: { fullName: "Priya Mehta", consentAccepted: true, ipAddress: "203.0.113.11", userAgent: "Mozilla/5.0 Chrome/136" }, razorpayOrderId: "order_seed_paid_0001", razorpayPaymentId: "pay_seed_paid_0001", razorpaySignature: "seed_signature_paid_0001", paymentMethod: "upi", paymentStatus: "paid", fulfillmentStatus: "completed", failureReason: null, adminNote: "Delivered automatically after payment verification.", paidAt: new Date("2026-04-02T10:05:00.000Z"), completedAt: new Date("2026-04-02T10:06:00.000Z"), completedBy: headAdmin._id.toString(), createdAt: new Date("2026-04-02T10:04:00.000Z"), updatedAt: new Date("2026-04-02T10:06:00.000Z"),
    },
    {
      orderNumber: "NP-2026-0002", itemType: "group", note: null, group: String(frontendGroup._id), itemSnapshot: itemSnapshot(frontendGroup.name, frontendGroup.slug, frontendGroup.price, frontendGroup.notes.map((n) => String(n))), amount: 49900, currency: "INR", buyer: { fullName: "Rohan Verma", consentAccepted: true, ipAddress: null, userAgent: "Mozilla/5.0 Safari/18" }, razorpayOrderId: "order_seed_created_0002", razorpayPaymentId: null, razorpaySignature: null, paymentMethod: null, paymentStatus: "created", fulfillmentStatus: "pending", failureReason: null, adminNote: null, paidAt: null, completedAt: null, completedBy: null, createdAt: new Date("2026-04-04T11:00:00.000Z"), updatedAt: new Date("2026-04-04T11:00:00.000Z"),
    },
    {
      orderNumber: "NP-2026-0003", itemType: "note", note: String(notes[2]._id), group: null, itemSnapshot: itemSnapshot(notes[2].title, notes[2].slug, notes[2].price, [String(notes[2]._id)]), amount: 59900, currency: "INR", buyer: { fullName: "Neha Iyer", consentAccepted: true, ipAddress: "198.51.100.42", userAgent: null }, razorpayOrderId: "order_seed_failed_0003", razorpayPaymentId: null, razorpaySignature: null, paymentMethod: "card", paymentStatus: "failed", fulfillmentStatus: "cancelled", failureReason: "Payment declined by issuing bank.", adminNote: "Customer may retry checkout.", paidAt: null, completedAt: null, completedBy: null, createdAt: new Date("2026-04-06T14:00:00.000Z"), updatedAt: new Date("2026-04-06T14:15:00.000Z"),
    },
    {
      orderNumber: "NP-2026-0004", itemType: "group", note: null, group: String(interviewGroup._id), itemSnapshot: itemSnapshot(interviewGroup.name, interviewGroup.slug, interviewGroup.price, interviewGroup.notes.map((n) => String(n))), amount: 129900, currency: "INR", buyer: { fullName: "Kabir Singh", consentAccepted: false, ipAddress: "192.0.2.88", userAgent: "Mozilla/5.0 Firefox/138" }, razorpayOrderId: "order_seed_pending_0004", razorpayPaymentId: null, razorpaySignature: null, paymentMethod: "netbanking", paymentStatus: "created", fulfillmentStatus: "pending", failureReason: null, adminNote: "Awaiting payment confirmation.", paidAt: null, completedAt: null, completedBy: null, createdAt: new Date("2026-04-08T16:00:00.000Z"), updatedAt: new Date("2026-04-08T16:00:00.000Z"),
    },
    {
      orderNumber: "NP-2026-0005", itemType: "note", note: String(notes[5]._id), group: null, itemSnapshot: itemSnapshot(notes[5].title, notes[5].slug, notes[5].price, [String(notes[5]._id)]), amount: 39900, currency: "INR", buyer: { fullName: "Ananya Rao", consentAccepted: true, ipAddress: "203.0.113.77", userAgent: "Mozilla/5.0 Edge/136" }, razorpayOrderId: "order_seed_cancelled_0005", razorpayPaymentId: "pay_seed_cancelled_0005", razorpaySignature: "seed_signature_cancelled_0005", paymentMethod: "wallet", paymentStatus: "paid", fulfillmentStatus: "cancelled", failureReason: null, adminNote: "Cancelled at customer request before delivery.", paidAt: new Date("2026-04-10T09:00:00.000Z"), completedAt: null, completedBy: null, createdAt: new Date("2026-04-10T08:59:00.000Z"), updatedAt: new Date("2026-04-10T09:30:00.000Z"),
    },
  ]);

  const activityDefinitions = [
    ["admin.register", "admin", headAdmin._id, "Mantu Kumar", "Registered the first head administrator."], ["admin.login", "admin", headAdmin._id, "Mantu Kumar", "Signed in to the admin dashboard."], ["admin.logout", "admin", contentAdmin._id, "Aarav Sharma", "Signed out of the admin dashboard."],
    ["note.create", "note", notes[0]._id, notes[0].title, "Created a free JavaScript note."], ["note.update", "note", notes[1]._id, notes[1].title, "Updated the React note metadata."], ["note.delete", "note", notes[5]._id, notes[5].title, "Deleted a duplicate database note."],
    ["group.create", "group", frontendGroup._id, frontendGroup.name, "Created the frontend bundle."], ["group.update", "group", interviewGroup._id, interviewGroup.name, "Updated the interview bundle price."], ["group.delete", "group", privateGroup._id, privateGroup.name, "Removed an obsolete private bundle."],
    ["category.create", "category", webCategory._id, webCategory.name, "Created the web development category."], ["category.update", "category", computerCategory._id, computerCategory.name, "Updated computer science subjects."], ["category.delete", "category", archivedCategory._id, archivedCategory.name, "Archived an unused category."],
    ["order.update_fulfillment", "order", new mongoose.Types.ObjectId(), "NP-2026-0001", "Marked a paid order as completed."], ["order.add_note", "order", new mongoose.Types.ObjectId(), "NP-2026-0002", "Added an internal order note."], ["order.delete", "order", new mongoose.Types.ObjectId(), "NP-2026-0003", "Removed a failed test order."],
  ] as const;
  await AdminActivity.insertMany(activityDefinitions.map(([action, targetType, targetId, targetLabel, description], index) => ({
    admin: index % 2 === 0 ? headAdmin._id : contentAdmin._id, action, targetType, targetId, targetLabel, description,
    metadata: { seed: true, sequence: index + 1, source: "seed.ts" }, ipAddress: index % 3 === 0 ? null : `192.0.2.${index + 10}`, userAgent: index % 4 === 0 ? null : "seed-script/1.0",
    createdAt: new Date(seedDate.getTime() + index * 3600000), updatedAt: new Date(seedDate.getTime() + index * 3600000),
  })));

  await Counter.insertMany([{ key: "order", seq: 5 }, { key: "note", seq: notes.length }, { key: "group", seq: 3 }]);
  console.log(`Seeded ${await Admin.countDocuments()} admins, ${await Category.countDocuments()} categories, ${await Note.countDocuments()} notes, ${await Group.countDocuments()} groups, ${await Order.countDocuments()} orders, and ${await AdminActivity.countDocuments()} activities.`);
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await mongoose.disconnect();
});