export const calculateExponentialBackoff = (
	attempts: number,
	baseDelaySeconds: number,
) => {
	// return baseDelaySeconds ** attempts;

	// Tentativa 1: 30 segundos
	// Tentativa 2: 240 segundos (4 minutos)
	// Tentativa 3: 1.920 segundos (32 minutos)
	// Tentativa 4: 15.360 segundos (4,27 horas)
	return baseDelaySeconds * Math.pow(8, attempts - 1);
};
