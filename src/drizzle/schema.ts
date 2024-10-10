import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  serial,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);
export const genderEnum = pgEnum("gender", ["Laki-laki", "Perempuan"]);
export const statusEnum = pgEnum("name", ["submit", "process", "done"]);

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

export type TUser = typeof userTable.$inferSelect;

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
  lokasiPrakerin: varchar("lokasi_prakerin").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const pendaftaranRelations = relations(pendaftaranTable, ({ many }) => ({
  peserta: many(pesertaTable),
}));

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

export const pesertaRelations = relations(pesertaTable, ({ one }) => ({
  pendaftaran: one(pendaftaranTable, {
    fields: [pesertaTable.pendaftaranId],
    references: [pendaftaranTable.id],
  }),
}));

// types
export type TPendaftaran = typeof pendaftaranTable.$inferSelect;
export type Peserta = typeof pesertaTable.$inferSelect;
export type PendaftaranWithPeserta = TPendaftaran & {
  peserta: Peserta[] | [];
};
