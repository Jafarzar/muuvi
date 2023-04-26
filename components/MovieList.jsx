import { ChevronRightIcon, StarIcon } from "@chakra-ui/icons";
import { FaImdb } from "react-icons/fa";
import {
  AspectRatio,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { useQuery } from "@tanstack/react-query";
import React, { useState, useRef } from "react";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

const useMoviesPerIds = (movieIds) => {
  const moviesPerId = useQuery(
    ["MOVIES_PER_ID", movieIds],
    async () => {
      const movies = await Promise.all(
        movieIds.map(async (id) => {
          const [trailerResponse, extResponse] = await Promise.all([
            fetch(
              `https://imdb-api.com/en/API/YouTubeTrailer/${process.env.NEXT_PUBLIC_KEY}/${id}`
            ),
            fetch(
              `https://imdb-api.com/en/API/Title/${process.env.NEXT_PUBLIC_KEY}/${id}`
            ),
          ]);
          const [trailerData, extData] = await Promise.all([
            trailerResponse.json(),
            extResponse.json(),
          ]);

          return {
            id,
            trailerId: trailerData.videoId,
            casts: extData.actorList.slice(0, 10),
            plot: extData.plot,
          };
        })
      );
      return movies;
    },
    {
      enabled: Boolean(movieIds),
    }
  );

  return moviesPerId;
};

const useFinalMovies = (movies) => {
  const ids = movies?.map((movie) => movie.id).slice(0, 10);

  const movieIds = useMoviesPerIds(ids);
  return useQuery(
    {
      queryKey: [
        "movies",
        {
          moviesData: movies?.map((item) => item.id),
          ids: movieIds.data?.map((item) => item.id),
        },
      ],
      queryFn: async () => {
        const moviesFinal = movies
          ?.map((movie) => {
            const movieData = movieIds.data?.find((mv) => mv.id === movie.id);
            return {
              ...movie,
              trailerId: `https://www.youtube.com/embed/${movieData?.trailerId}`,
              casts: movieData?.casts,
              plot: movieData?.plot,
            };
          })
          .slice(0, 10);

        return moviesFinal;
      },
    },
    {
      enabled: !!movies && !!movieIds.data,
    }
  );
};

const MovieList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedData, setSelectedData] = useState(null);

  const modalHandler = (movie) => {
    setSelectedData(movie);
    onOpen(true);
  };

  const popMovies = useQuery(["MOVIES_POPULAR"], async () => {
    const response = await fetch(
      `https://imdb-api.com/en/API/MostPopularMovies/${process.env.NEXT_PUBLIC_KEY}`
    );
    const data = await response.json();
    return data.items;
  });
  const popFinalMovies = useFinalMovies(popMovies.data);

  const soonMovies = useQuery(["MOVIES_COMINGSOON"], async () => {
    const response = await fetch(
      `https://imdb-api.com/en/API/ComingSoon/${process.env.NEXT_PUBLIC_KEY}`
    );
    const data = await response.json();
    return data.items;
  });
  const soonFinalMovies = useFinalMovies(soonMovies.data);

  return (
    <Container maxW="1440px" w="full" p={0}>
      <VStack px={[6, 6, 24]} py={[6, 6, 24]} spacing={16}>
        <Stack w="full" spacing={4}>
          <HStack justify="space-between">
            <Heading size={["md", "md", "xl"]}>Featured Movie</Heading>
            <Button variant="link" color="#f6febb" size={["xs", "xs", "md"]}>
              See more <ChevronRightIcon />
            </Button>
          </HStack>
          <Box h={[350, 350, 600]}>
            <Swiper
              navigation={true}
              modules={[Navigation]}
              slidesPerView={2}
              spaceBetween={30}
              breakpoints={{
                480: {
                  slidesPerView: 4,
                },
              }}
            >
              {popFinalMovies?.error ? (
                <Text>
                  {"An error has occurred: " + popFinalMovies.error.message}{" "}
                </Text>
              ) : (
                popFinalMovies.data?.map((movie) => (
                  <SwiperSlide key={movie.id}>
                    <Box
                      maxW={300}
                      w="full"
                      h={[240, 240, 400]}
                      position="relative"
                    >
                      <Image
                        src={movie.image}
                        alt={movie.title}
                        fill
                        style={{ objectFit: "cover" }}
                        priority
                        placeholder="blur"
                        blurDataURL="/img/imgplace.png"
                        onError={(err) => {
                          err.target.onError = null;
                          err.target.src = "/img/imgerror.png";
                        }}
                      />
                    </Box>
                    <Skeleton isLoaded={!popFinalMovies.isLoading}>
                      <Text opacity={0.6} mt={4} fontSize={["xs", "xs", "md"]}>
                        {movie.year}
                      </Text>
                    </Skeleton>

                    <Skeleton isLoaded={!popFinalMovies.isLoading}>
                      <Heading
                        as="button"
                        textAlign="left"
                        size={["sm", "sm", "lg"]}
                        maxW="300px"
                        onClick={() => modalHandler(movie)}
                        _hover={{ textDecor: "underline" }}
                      >
                        {movie.title}
                      </Heading>
                    </Skeleton>

                    <Skeleton isLoaded={!popFinalMovies.isLoading}>
                      <Stack direction="row" gap={[4, 4, 8]}>
                        <HStack>
                          <Icon as={FaImdb} w={[2, 2, 4]} color="yellow.400" />
                          <Text fontSize={["xs", "xs", "md"]}>
                            {movie.imDbRating ? movie.imDbRating : "-"}
                          </Text>
                        </HStack>
                      </Stack>
                    </Skeleton>
                    <Skeleton isLoaded={!popFinalMovies.isLoading}>
                      <Text fontSize="xs">{movie.crew}</Text>
                    </Skeleton>
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          </Box>
        </Stack>

        <Stack w="full" spacing={4}>
          <HStack justify="space-between">
            <Heading size={["md", "md", "xl"]}>Coming Soon</Heading>
            <Button variant="link" color="#f6febb" size={["xs", "xs", "md"]}>
              See more <ChevronRightIcon />
            </Button>
          </HStack>
          <Box h={[350, 350, 600]}>
            <Swiper
              navigation={true}
              modules={[Navigation]}
              slidesPerView={2}
              spaceBetween={30}
              breakpoints={{
                480: {
                  slidesPerView: 4,
                },
              }}
            >
              {soonFinalMovies?.error ? (
                <Text>
                  {"An error has occurred: " + soonFinalMovies.error.message}{" "}
                </Text>
              ) : (
                soonFinalMovies.data?.map((movie) => (
                  <SwiperSlide key={movie.id}>
                    <Box
                      maxW={300}
                      w="full"
                      h={[240, 240, 400]}
                      position="relative"
                    >
                      <Image
                        src={movie.image}
                        alt={movie.title}
                        fill
                        style={{ objectFit: "cover" }}
                        priority
                        placeholder="blur"
                        blurDataURL="/img/imgplace.png"
                        onError={(err) => {
                          err.target.onError = null;
                          err.target.src = "/img/imgerror.png";
                        }}
                      />
                    </Box>

                    <Skeleton isLoaded={!soonFinalMovies.isLoading}>
                      <Heading
                        as="button"
                        textAlign="left"
                        size={["sm", "sm", "lg"]}
                        maxW="300px"
                        mt={4}
                        onClick={() => modalHandler(movie)}
                        _hover={{ textDecor: "underline" }}
                      >
                        {movie.fullTitle}
                      </Heading>
                    </Skeleton>
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          </Box>
        </Stack>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />

          {selectedData && (
            <ModalContent maxW={800} bg="teal.400">
              <ModalHeader
                textAlign="center"
                bg="teal"
                fontSize={["sm", "sm", "lg"]}
              >
                {selectedData.title}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody p={8}>
                <AspectRatio w="full" ratio={1.7777}>
                  <iframe
                    title={selectedData.title}
                    src={selectedData.trailerId}
                  />
                </AspectRatio>
                <Stack direction="row" align="center" my={4}>
                  <Heading fontSize={["sm", "sm", "lg"]}>
                    {selectedData.title}
                  </Heading>
                  <Text
                    fontSize={["xs", "xs", "md"]}
                    fontWeight="bold"
                    mt={4}
                    w="fit-content"
                    h="fit-content"
                    px={2}
                    py={1}
                    bg="teal"
                    borderRadius={4}
                  >
                    {selectedData.year}
                  </Text>
                </Stack>
                <HStack mt={2}>
                  <Icon as={FaImdb} w={4} color="yellow.400" />
                  <Text fontSize={["xs", "xs", "md"]}>Imdb Rating: </Text>
                  <Text fontSize={["xs", "xs", "md"]}>
                    {selectedData.imDbRating ? selectedData.imDbRating : "-"}
                  </Text>
                </HStack>
                <Text mt={2} fontSize={["xs", "xs", "md"]}>
                  {selectedData.plot}
                </Text>
                <Heading fontSize={["sm", "sm", "md"]} mt={6} mb={2}>
                  Casts
                </Heading>
                <Swiper
                  navigation={true}
                  modules={[Navigation]}
                  spaceBetween={10}
                  slidesPerView={3}
                  breakpoints={{
                    480: {
                      slidesPerView: 4,
                      spaceBetween: 20,
                    },
                  }}
                >
                  {selectedData.casts?.map((cast) => (
                    <SwiperSlide key={cast.id}>
                      <Box
                        position="relative"
                        maxW={140}
                        w="full"
                        h={[130, 130, 200]}
                        mb={2}
                        bg="teal.800"
                      >
                        <Image
                          src={cast.image}
                          alt={cast.name}
                          fill
                          style={{ objectFit: "cover", opacity: 0.7 }}
                        />
                      </Box>
                      <Text>{cast.asCharacter}</Text>
                      <Text opacity={0.6}>{cast.name}</Text>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="teal" mb={3} mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          )}
        </Modal>
      </VStack>
    </Container>
  );
};

export default MovieList;
