import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  serial,
  date,
} from "drizzle-orm/pg-core";

// enums
export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);
export const genderEnum = pgEnum("gender", ["Laki-laki", "Perempuan"]);
export const statusEnum = pgEnum("name", ["submit", "process", "done"]);
export const postEnum = pgEnum("category", ["Pengumuman", "Agenda", "Berita"]);

// tables
export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").unique().notNull(),
  role: roleEnum("role").default("USER"),
  nis: varchar("nis").unique(),
  hashedPassword: varchar("hashedPassword").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const pendaftaranTable = pgTable("pendaftaran", {
  id: serial("id").primaryKey(),
  instansi: varchar("instansi").notNull(),
  lokasiPrakerin: varchar("lokasi_prakerin").notNull(),
  tanggalMulai: date("tanggal_mulai"),
  tanggalSelesai: date("tanggal_selesai"),
  durasiPrakerin: varchar("durasi_prakerin"),
  userId: text("user_id").references(() => userTable.id),
  statusId: serial("statusId")
    .notNull()
    .references(() => statusTable.id),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const pesertaTable = pgTable("peserta_prakerin", {
  id: serial("id").primaryKey(),
  nama: varchar("nama").notNull(),
  jurusan: varchar("jurusan").notNull(),
  gender: genderEnum("gender").notNull(),
  keterangan: text("keterangan"),
  pendaftaranId: serial("pendaftaranId")
    .notNull()
    .references(() => pendaftaranTable.id),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const statusTable = pgTable("status", {
  id: serial("id").primaryKey(),
  name: statusEnum("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const suratPermohonanTable = pgTable("surat_permohonan", {
  id: serial("id").primaryKey(),
  fileUrl: varchar("file_url", { length: 255 }),
  downloadUrl: varchar("download_url", { length: 255 }),
  pendaftaranId: serial("pendaftaran_id")
    .notNull()
    .references(() => pendaftaranTable.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const suratPengantarTable = pgTable("surat_pengantar", {
  id: serial("id").primaryKey(),
  fileUrl: varchar("file_url", { length: 255 }),
  downloadUrl: varchar("download_url", { length: 255 }),
  pendaftaranId: serial("pendaftaran_id")
    .notNull()
    .references(() => pendaftaranTable.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  kepalaSekolah: varchar("kepala_sekolah", { length: 100 }).notNull(),
  nipKepalaSekolah: varchar("nip_kepala_sekolah", { length: 100 }).notNull(),
  signatureFileUrl: varchar("signature_file_url", { length: 255 }),
  signatureDownloadUrl: varchar("signature_download_url", { length: 255 }),
  qrFileUrl: varchar("qr_file_url", { length: 255 }),
  qrDownloadUrl: varchar("qr_download_url", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});



export const postTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  category: postEnum("category"),
  body: text("body").notNull(),
  userId: varchar("userId", { length: 100 })
    .notNull()
    .references(() => userTable.id),
  excerpt: text("excerpt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// relations
export const pesertaRelations = relations(pesertaTable, ({ one }) => ({
  pendaftaran: one(pendaftaranTable, {
    fields: [pesertaTable.pendaftaranId],
    references: [pendaftaranTable.id],
  }),
}));

export const pendaftaranRelations = relations(
  pendaftaranTable,
  ({ one, many }) => ({
    peserta: many(pesertaTable),
    status: one(statusTable, {
      fields: [pendaftaranTable.statusId],
      references: [statusTable.id],
    }),
  }),
);

export const suratPermohonanRelations = relations(
  suratPermohonanTable,
  ({ one }) => ({
    pendaftaran: one(pendaftaranTable, {
      fields: [suratPermohonanTable.pendaftaranId],
      references: [pendaftaranTable.id],
    }),
  }),
);

export const suratPengantarRelations = relations(
  suratPengantarTable,
  ({ one }) => ({
    pendaftaran: one(pendaftaranTable, {
      fields: [suratPengantarTable.pendaftaranId],
      references: [pendaftaranTable.id],
    }),
  }),
);

// types
export type TUser = typeof userTable.$inferSelect;
export type TPendaftaran = typeof pendaftaranTable.$inferSelect;
export type Peserta = typeof pesertaTable.$inferSelect;
export type Status = typeof statusTable.$inferSelect;
export type SuratPermohonan = typeof suratPermohonanTable.$inferSelect;
export type PendaftaranWithPeserta = TPendaftaran & {
  peserta: Peserta[] | [];
  status: Status;
};
export type TSettings = typeof settingsTable.$inferSelect;
export type TPost = typeof postTable.$inferSelect;

