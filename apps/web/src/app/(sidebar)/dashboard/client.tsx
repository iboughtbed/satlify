"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { trpc } from "@/trpc/react";
import type { Session } from "@/lib/auth-types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { practiceTestTypes } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, ClockIcon, PlayIcon, BarChart3Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function Dashboard({ session }: { session: Session }) {
  const [selectedTestType, setSelectedTestType] =
    React.useState<(typeof practiceTestTypes)[number]>("full");

  const createPracticeTest = trpc.practiceTest.create.useMutation();
  const createTestAttempt = trpc.testAttempts.create.useMutation();
  const practiceTests = trpc.practiceTest.get.useQuery();
  const testAttempts = trpc.testAttempts.get.useQuery();
  const trpcUtils = trpc.useUtils();

  function handleCreatePracticeTest() {
    createPracticeTest.mutate(
      { type: selectedTestType },
      {
        onSuccess: () => {
          trpcUtils.practiceTest.get.invalidate();
          trpcUtils.testAttempts.get.invalidate();
        },
      },
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col space-y-8 px-4 md:px-10 md:py-16">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Practice Tests</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create a test</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a test</DialogTitle>
              <DialogDescription>
                Select the sections you want to include in your test.
              </DialogDescription>
            </DialogHeader>
            <div className="">
              <Select
                value={selectedTestType}
                onValueChange={(value) => {
                  setSelectedTestType(
                    value as (typeof practiceTestTypes)[number],
                  );
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="math">Math</SelectItem>
                    <SelectItem value="verbal">Verbal</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleCreatePracticeTest}
                disabled={createPracticeTest.isPending}
              >
                {createPracticeTest.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      <div className="space-y-5">
        <h3 className="text-xl font-medium">Available Tests</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {practiceTests.data?.map((test) => (
            <Card key={test.id} className="overflow-hidden bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{test.title}</CardTitle>
                  <Badge
                    variant={
                      test.type === "full"
                        ? "default"
                        : test.type === "math"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {test.type.charAt(0).toUpperCase() + test.type.slice(1)}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1 text-xs">
                  <CalendarIcon className="h-3 w-3" />
                  {new Date(test.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  {test.type === "full"
                    ? "Complete SAT practice test with math and verbal sections"
                    : `SAT ${test.type} section practice test`}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/tests/${test.id}`}>
                    <PlayIcon className="mr-2 h-4 w-4" />
                    Start Test
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

          {practiceTests.data?.length === 0 && (
            <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                No practice tests available
              </p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => document.querySelector("button")?.click()}
              >
                Create your first test
              </Button>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Test Attempts Section */}
      <div className="space-y-5">
        <h3 className="text-xl font-medium">Your Attempts</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {testAttempts.data?.map((attempt) => (
            <Card key={attempt.id} className="bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Test Attempt {attempt.id.substring(0, 8)}
                  </CardTitle>
                  <Badge
                    variant={
                      attempt.status === "completed"
                        ? "default"
                        : attempt.status === "active"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {attempt.status === "completed"
                      ? "Completed"
                      : attempt.status === "active"
                        ? "In Progress"
                        : "Not Started"}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <ClockIcon className="h-3 w-3" />
                  {new Date(attempt.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between pt-4">
                {attempt.status === "completed" ? (
                  <Button variant="outline" className="w-full">
                    <BarChart3Icon className="mr-2 h-4 w-4" />
                    View Results
                  </Button>
                ) : attempt.status === "active" ? (
                  <Button className="w-full">
                    <PlayIcon className="mr-2 h-4 w-4" />
                    Continue Test
                  </Button>
                ) : (
                  <Button className="w-full">
                    <PlayIcon className="mr-2 h-4 w-4" />
                    Start Test
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}

          {testAttempts.data?.length === 0 && (
            <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">No test attempts yet</p>
              <p className="text-xs text-muted-foreground">
                Take a practice test to see your results here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
