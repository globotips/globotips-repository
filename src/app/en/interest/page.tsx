import {
  InterestSignup,
  interestSignupMetadata,
} from "@/components/interest-signup";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return interestSignupMetadata();
}

export default function EnglishInterestPage() {
  return <InterestSignup source="en/interest" />;
}
