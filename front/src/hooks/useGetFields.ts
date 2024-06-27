import { computed } from 'vue';

interface Field<T> {
    label: string;
    field: keyof T;
    type: string;
}

interface Props<T> {
    errors: Record<keyof T, string | null>
    fieldsConfig: Field<T>[]
}

export function useFields<T extends Object>({errors, fieldsConfig} : Props<T>) {
  const fields = computed(() => fieldsConfig.map(({ label, field, type }) => ({
    label,
    field,
    type: type || 'text',
    hasError: !!errors[field],
    error: errors[field],
  })));

  return { fields };
}