import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  arenas: defineTable({
    name: v.string()
  })
});
