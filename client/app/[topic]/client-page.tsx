"use client";

import { submitComment } from "@/actions";

import { useEffect, useState } from "react";
import { Wordcloud } from "@visx/wordcloud";
import { scaleLog } from "@visx/scale";
import { Text } from "@visx/text";
import { useMutation } from "@tanstack/react-query";
import { io } from "socket.io-client";

import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const socket = io("http://localhost:8080");

type Props = {
  topicName: string;
  initialData: {
    text: string;
    value: number;
  }[];
};

const COLORS = ["#133059", "#2f6b9a", "#82a6c2"];

export const ClientPage = ({ topicName, initialData }: Props) => {
  const [words, setWords] = useState(initialData);
  const [input, setInput] = useState<string>("");
  
  useEffect(() => {
    socket.emit("join-room", `room:${topicName}`)
  }, [topicName]);

  useEffect(() => {
    socket.on("room-update", (message: string) => {
      const data = JSON.parse(message) as {
        text: string;
        value: number;
      }[];

      data.map((newWord) => {
        const isWordAlreadyIncluded = words.some((word) => word.text === newWord.text);

        if (isWordAlreadyIncluded) {
          // inc
          setWords((pre) => {
            const before = pre.find((word) => word.text === newWord.text);
            const rest = pre.filter((word) => word.text !== newWord.text);

            return [
              ...rest, 
              { text: before!.text, value: before!.value + newWord.value },
            ];
          });
        } else if (words.length < 50) {
          setWords((pre) => [...pre, newWord]);
        };
      });
    });

    return () => {
      socket.off("room-update");
    }
  }, [words]);

  const fontScale = scaleLog({
    domain: [
      Math.min(...words.map((w) => w.value)),
      Math.max(...words.map((w) => w.value)),
    ],
    range: [10, 100],
  });

  const { mutate, isPending } = useMutation({
    mutationFn: submitComment,
  });

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-zinc-50 pb-20">
      <MaxWidthWrapper className="flex flex-col items-center gap-6 pt-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-center tracking-tight text-balance">
          What people think about{" "}
          <span className="text-blue-600">{topicName}</span>
        </h1>

        <p className="text-sm">(Updated in real-time)</p>

        <div className="aspect-square max-w-xl items-center justify-center">
          <Wordcloud
            words={words}
            width={500}
            height={500}
            fontSize={(data) => fontScale(data.value)}
            font={"Impact"}
            padding={2}
            spiral="archimedean"
            rotate={0}
            random={() => 0.5}
          >
            {(cloudWords) =>
              cloudWords.map((w, i) => (
                <Text
                  key={w.text}
                  fill={COLORS[i % COLORS.length]}
                  textAnchor="middle"
                  transform={`translate(${w.x}, ${w.y})`}
                  fontSize={w.size}
                  fontFamily={w.font}
                >
                  {w.text}
                </Text>
              ))
            }
          </Wordcloud>
        </div>
        <div className="max-w-lg w-full">
          <Label className="font-semibold tracking-tight text-lg pb-2">
            Here&rsquo;s what I think about {topicName}
          </Label>
          <div className="mt-1 flex gap-2 items-center">
            <Input
              value={input}
              disabled={isPending}
              onChange={({ target }) => setInput(target.value)}
              placeholder={`${topicName} is absolutely...`}
            />
            <Button 
              onClick={() => mutate({ comment: input, topicName })}
              disabled={isPending}
            >
              Share
            </Button>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};
