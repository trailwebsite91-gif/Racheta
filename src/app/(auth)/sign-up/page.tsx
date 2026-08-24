import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Start designing and selling in minutes
        </p>
      </div>

      <SignUp
        forceRedirectUrl="/dashboard/onboarding"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none border-0 rounded-none w-full p-0 bg-transparent",
            header: "hidden",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtons: "gap-3",
            socialButtonsBlockButton:
              "border-border rounded-lg h-11 text-sm font-medium hover:bg-accent transition-colors",
            socialButtonsBlockButtonText: "text-sm font-medium",
            socialButtonsProviderIcon: "w-5 h-5",
            dividerLine: "bg-border",
            dividerText: "text-muted-foreground text-xs",
            formFieldLabel: "text-sm font-medium text-foreground",
            formFieldInput:
              "h-11 rounded-lg border-input bg-background text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
            formFieldInputShowPasswordButton: "text-muted-foreground",
            formButtonPrimary:
              "h-11 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm",
            formFieldAction: "text-sm text-primary hover:text-primary/80",
            footer: "hidden",
            footerAction: "hidden",
            footerActionText: "hidden",
            footerActionLink: "hidden",
            identityPreview: "bg-muted rounded-lg",
            identityPreviewEditButton: "text-primary",
            formResendCodeLink: "text-primary",
            alert: "rounded-lg",
            alertText: "text-sm",
          },
          layout: {
            socialButtonsPlacement: "bottom",
            socialButtonsVariant: "blockButton",
            showOptionalFields: false,
          },
        }}
      />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
