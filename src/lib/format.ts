export const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
export const dateTime = (value: string) => new Date(value).toLocaleString();
