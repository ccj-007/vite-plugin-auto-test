import { watch } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
export const useRouteChange = (fn: (val: string, oldVal?: string) => void) => {
  watch(
    () => router.currentRoute.value.path,
    (val: string, oldVal: string | undefined) => {
      console.log('watch', val);
      fn && fn(val, oldVal);
    },
    { immediate: true },
  );
};
