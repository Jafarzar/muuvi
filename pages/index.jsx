import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MovieList from "@/components/MovieList";
import { Container } from "@chakra-ui/react";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Movie Project by Jafarzar</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="100vw" w="full" position="relative" p={0}>
        <Header />

        <Hero />

        <MovieList />

        <Footer />
      </Container>
    </>
  );
}
