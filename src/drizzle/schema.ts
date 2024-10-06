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
  nama: varchar("nama").notNull(),
  jurusan: varchar("jurusan").notNull(),
  lokasiPrakerin: varchar("lokasi_prakerin").notNull(),
  gender: genderEnum("gender").notNull(),
  kontak: varchar("kontak").notNull(),
  userId: varchar("userId", { length: 100 })
    .notNull()
    .references(() => userTable.id),
});

export type TPendaftaran = typeof pendaftaranTable.$inferSelect;

export const pendaftaranRelations = relations(pendaftaranTable, ({ one }) => ({
  user: one(userTable, {
    fields: [pendaftaranTable.userId],
    references: [userTable.id],
  }),
}));
