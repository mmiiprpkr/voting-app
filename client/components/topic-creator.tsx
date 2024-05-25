"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createTopic } from "@/actions";

export const TopicCreator = () => {
  const [input, setInput] = useState<string>();

  const { mutate, error, isPending } = useMutation({
    mutationFn: createTopic
  });

  return (
    <div className="mt-12 flex flex-col gap-2">
      <div className="flex gap-2">
        <Input 
          value={input}
          onChange={({ target }) => setInput(target.value)}
          className="bg-white min-w-64"
          placeholder="Enter topic here..."
        />
        <Button
          type="submit"
          disabled={isPending}
          onClick={() => mutate({ topicName: input as string })}
        >
          Create
        </Button>
      </div>

      {error ? <p className="text-sm text-red-600">{error.message}</p> : null}
    </div>
  );
};