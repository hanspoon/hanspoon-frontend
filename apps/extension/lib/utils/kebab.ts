export const camelToKebab = (str: string) =>
	str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
