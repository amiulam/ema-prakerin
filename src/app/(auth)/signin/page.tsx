import { SignInForm } from "./form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function SignInPage() {
  return (
    <Card className="w-[400px]">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-x-1.5">
          <Image
            src="/logo-ipsum.svg"
            alt="the-logo"
            height={50}
            width={50}
            className="size-7"
          />{" "}
          <p>Sign In</p>
        </CardTitle>
        <CardDescription>
          Log in to your account to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
    </Card>
  );
}
