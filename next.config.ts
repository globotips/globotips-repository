import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "bcryptjs", "stripe"],
  agentRules: false,
};

export default nextConfig;
