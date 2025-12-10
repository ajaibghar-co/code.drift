import { redirect } from "next/navigation";

export default function NotFound() {
  redirect("/coming-soon");

  // Return valid JSX (won't be shown because redirect already fired)
  return <div />;
}
