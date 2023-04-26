import { ArrowForwardIcon } from "@chakra-ui/icons";
import { FaImdb } from "react-icons/fa";
import { GiTomato } from "react-icons/gi";
import {
  Box,
  Button,
  Container,
  Fade,
  Heading,
  HStack,
  Icon,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";

import Image from "next/image";
import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Pagination, Autoplay, EffectFade } from "swiper";

const Hero = () => {
  const theatersFetch = async () => {
    const response = await fetch(
      `https://imdb-api.com/en/API/InTheaters/${process.env.NEXT_PUBLIC_KEY}`
    );
    const data = await response.json();
    const ids = data.items.map((movie) => movie.id).slice(0, 5);

    const movies = await Promise.all(
      ids.map(async (id) => {
        const [trailerResponse, posterResponse] = await Promise.all([
          fetch(
            `https://imdb-api.com/en/API/YouTubeTrailer/${process.env.NEXT_PUBLIC_KEY}/${id}`
          ),
          fetch(
            `https://imdb-api.com/en/API/Posters/${process.env.NEXT_PUBLIC_KEY}/${id}`
          ),
        ]);
        const [trailerData, posterData] = await Promise.all([
          trailerResponse.json(),
          posterResponse.json(),
        ]);

        const posters = posterData.backdrops.find(
          (poster) => poster.aspectRatio === 1.7777777777777777
        );

        return {
          id,
          trailerUrl: trailerData.videoUrl,
          posterUrl: posters.link,
        };
      })
    );

    const moviesFinal = data.items
      .map((movie) => {
        const movieData = movies.find((mv) => mv.id === movie.id);
        return {
          ...movie,
          trailerUrl: movieData?.trailerUrl,
          posterUrl: movieData?.posterUrl,
        };
      })
      .slice(0, 5);

    return moviesFinal;
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["theater"],
    queryFn: theatersFetch,
  });

  if (error) return "An error has occurred: " + error.message;

  return (
    <Container maxW="100vw" w="full" h="100vh" p={0}>
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        pagination={(true, { clickable: true })}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        effect={"fade"}
        slidesPerView={1}
      >
        {data?.slice(0, 5).map((movie) => (
          <SwiperSlide key={movie.id}>
            <Box position="relative" h="100vh" bg="black">
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                fill
                style={{ objectFit: "cover", opacity: 0.6 }}
                priority
                placeholder="blur"
                blurDataURL="/img/imgplace.png"
                onError={(err) => {
                  err.target.onError = null;
                  err.target.src = "/img/imgerror.png";
                }}
              />

              <Stack
                direction={["column", "column", "row"]}
                px={[6, 6, 24]}
                pb={[12, 12, 0]}
                pt={450}
                h="full"
                align="center"
                justify={["flex-end", "flex-end", "space-between"]}
                textColor="white"
              >
                <Stack spacing={4} maxW={["full", "full", 450]} zIndex="2">
                  <Skeleton isLoaded={!isLoading}>
                    <Heading>{movie.title}</Heading>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading} w="min-content">
                    <Stack direction="row" gap={8}>
                      <HStack>
                        <Icon as={FaImdb} w={8} h={8} color="yellow.400" />
                        <Text>{movie.imDbRating}</Text>
                      </HStack>
                      <HStack>
                        <Icon as={GiTomato} w={8} h={8} color="tomato" />
                        <Text>{movie.metacriticRating}</Text>
                      </HStack>
                    </Stack>
                  </Skeleton>

                  <SkeletonText isLoaded={!isLoading}>
                    <Text>{movie.plot}</Text>
                  </SkeletonText>
                  <Button
                    as="a"
                    target="_blank"
                    href={movie.trailerUrl}
                    bg="red.700"
                    px={6}
                    gap={4}
                    w="fit-content"
                    _hover={{ bg: "red.600" }}
                  >
                    <ArrowForwardIcon
                      bg="white"
                      borderRadius={999}
                      color="red.700"
                    />
                    <Text>Watch Trailer</Text>
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default Hero;
