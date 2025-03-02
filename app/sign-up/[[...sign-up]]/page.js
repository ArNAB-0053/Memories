import { SignUp } from "@clerk/nextjs"

export const metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
            card: "shadow-md rounded-lg",
          },
        }}
      />
    </div>
  )
}

