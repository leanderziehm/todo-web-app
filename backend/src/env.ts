const requiredEnvVars = [
  "POSTGRES_HOST",
  "POSTGRES_DATABASE",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
] as const;

type RequiredEnv = (typeof requiredEnvVars)[number];

export function validateEnv() {
  const missingVars: string[] = [];

  for (const key of requiredEnvVars) {
    if (!process.env[key] || process.env[key]?.trim() === "") {
      missingVars.push(key);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }
}

// validateEnv();

// export const env = {
//   POSTGRES_HOST: process.env.POSTGRES_HOST!,
//   POSTGRES_DATABASE: process.env.POSTGRES_DATABASE!,
//   POSTGRES_USER: process.env.POSTGRES_USER!,
//   POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD!,
// } satisfies Record<RequiredEnv, string>;
