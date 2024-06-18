import { ref } from 'vue';

export const useDebounce = <T extends (...args: any[]) => void>(fn: T, delay: number): T => {
  const timeout = ref<ReturnType<typeof setTimeout> | null>(null);

  const debouncedFunction = ((...args: Parameters<T>) => {
    if (timeout.value !== null) {
      clearTimeout(timeout.value);
    }
    timeout.value = setTimeout(() => {
      fn(...args);
    }, delay);
  }) as T;

  return debouncedFunction;
}
