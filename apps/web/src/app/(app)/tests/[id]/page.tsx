import { trpc } from "@/trpc/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, PlayIcon, ClockIcon } from "lucide-react";

type Params = Promise<{ id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;

  const practiceTest = await trpc.practiceTest.getById({ id });

  if (!practiceTest) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center space-y-4 px-4 py-16 md:px-10">
        <h2 className="text-2xl font-bold">Test not found</h2>
        <p className="text-muted-foreground">
          The test you are looking for does not exist.
        </p>
        <Button asChild>
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col space-y-8 px-4 py-8 md:px-10 md:py-16">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {practiceTest.title}
        </h2>
        <Badge
          variant={
            practiceTest.type === "full"
              ? "default"
              : practiceTest.type === "math"
                ? "secondary"
                : "outline"
          }
          className="text-sm"
        >
          {practiceTest.type.charAt(0).toUpperCase() +
            practiceTest.type.slice(1)}
        </Badge>
      </div>

      <Separator />

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Test Overview</CardTitle>
          <CardDescription className="flex items-center gap-1 text-sm">
            <CalendarIcon className="h-4 w-4" />
            Created on {new Date(practiceTest.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-muted-foreground">
              {practiceTest.type === "full"
                ? "Complete SAT practice test with math and verbal sections"
                : `SAT ${practiceTest.type} section practice test`}
            </p>
          </div>

          <div>
            <h3 className="font-medium">Estimated Time</h3>
            <p className="flex items-center gap-1 text-muted-foreground">
              <ClockIcon className="h-4 w-4" />
              {practiceTest.type === "full" ? "3 hours" : "1.5 hours"}
            </p>
          </div>

          <div>
            <h3 className="font-medium">Instructions</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              <li>
                Make sure you have a quiet environment with no distractions
              </li>
              <li>Have scratch paper and pencil ready for calculations</li>
              <li>Once started, the test timer will begin automatically</li>
              <li>
                You can pause the test if needed, but the timer will continue
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={`/tests/${id}/start`}>
              <PlayIcon className="mr-2 h-4 w-4" />
              Start Test
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
