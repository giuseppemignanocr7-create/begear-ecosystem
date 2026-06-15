import { z } from "zod";

export const coreMindEnvironmentSchema = z.object({
  CLAUDE_API_KEY: z.string().min(1),
});

export type CoreMindEnvironment = z.infer<typeof coreMindEnvironmentSchema>;

export function readCoreMindEnvironment(
  env: NodeJS.ProcessEnv,
): CoreMindEnvironment | null {
  const parsedEnvironment = coreMindEnvironmentSchema.safeParse(env);
  return parsedEnvironment.success ? parsedEnvironment.data : null;
}
