<script setup lang="ts" generic="TData, TArgs extends DefaultFunctionArgs">
import { api } from '@/api';

import type {
  DefaultFunctionArgs,
  FunctionReference,
  OptionalRestArgs
} from 'convex/server';

type QueryFunc = FunctionReference<'query', 'public', TArgs, TData>;

const { query, args } = defineProps<{
  query: (_api: typeof api) => QueryFunc;
  args: OptionalRestArgs<QueryFunc>;
}>();

const data = await useSuspenseQuery(query(api), () => args);
</script>

<template>
  <slot :data="data" />
</template>
