export const delayInMs = async (value: number) => {
  await new Promise(resolve => setTimeout(resolve, value));
}