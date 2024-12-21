import { sqliteTable, AnySQLiteColumn, index, text, numeric, foreignKey } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	email: text("email").notNull(),
	role: text("role").notNull(),
	createdAt: numeric("created_at").default(sql`(CURRENT_TIMESTAMP)`),
},
(table) => {
	return {
		idxUsersEmail: index("idx_users_email").on(table.email),
	}
});

export const todos = sqliteTable("todos", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	description: text("description"),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	createdAt: numeric("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	isPublic: numeric("is_public").notNull(),
},
(table) => {
	return {
		idxTodosIsPublic: index("idx_todos_is_public").on(table.isPublic),
		idxTodosUserId: index("idx_todos_user_id").on(table.userId),
	}
});