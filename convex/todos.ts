import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {},
  handler: async ctx => {
    return ctx.db.query('todos').order('desc').take(100);
  }
});

export const remove = mutation({
  args: { id: v.id('todos') },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  }
});

export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, { text }) => {
    await ctx.db.insert('todos', { text, completed: false });
  }
});

export const setCompleted = mutation({
  args: { completed: v.boolean(), id: v.id('todos') },
  handler: async (ctx, { id, completed }) => {
    await ctx.db.patch(id, { completed });
  }
});
