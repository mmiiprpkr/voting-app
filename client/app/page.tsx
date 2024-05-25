import { Star } from "lucide-react";

import { redis } from "@/lib/redis";

import { TopicCreator } from "@/components/topic-creator";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

const HomePage = async () => {
  const serverRequest = await redis.get("served-request");

  return ( 
    <section className="min-h-screen bg-zinc-50">
      <MaxWidthWrapper className="relative pb-24 pt-10 sm:pb-32 lg:pt-24 xl:pt-32 lg:pb-52">
        <div className="hidden lg:block absolute inset-0 top-8">
          {/* circle */}
        </div>

        <div className="px-6 lg:px-0 lg:pt-4">
          <div className="relative mx-auto text-center flex flex-col items-center">
            <h1 className="relative leading-snug w-fit tracking-tight text-balance mt-16 font-bold text-gray-900 text-5xl md:text-6xl">
              What do you <span className="whitespace-nowrap">think</span> about....
            </h1>
            <TopicCreator />
            <div className="mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="flex flex-col gap-1 justify-between items-center sm:items-start">
                <div className="flex gap-0.5">
                  <Star className="size-4 w-4 text-green-600 fill-green-600"/>
                  <Star className="size-4 w-4 text-green-600 fill-green-600"/>
                  <Star className="size-4 w-4 text-green-600 fill-green-600"/>
                  <Star className="size-4 w-4 text-green-600 fill-green-600"/>
                  <Star className="size-4 w-4 text-green-600 fill-green-600"/>
                </div>
                <p>
                  <span className="font-semibold">
                    {Math.ceil(Number(serverRequest) / 10) * 10}
                  </span>{" "}
                  served requests
                </p>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};
 
export default HomePage;