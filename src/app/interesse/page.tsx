import {
  InterestSignup,
  interestSignupMetadata,
} from "@/components/interest-signup";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return interestSignupMetadata();
}

export default function InteressePage() {
  return <InterestSignup source="interesse" />;
}
