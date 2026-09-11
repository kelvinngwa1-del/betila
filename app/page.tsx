"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  MapPin,
  MessageCircleHeart,
  Plane,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Stage =
  | "intro"
  | "permission"
  | "hearts"
  | "home"
  | "bamenda"
  | "douala"
  | "more"
  | "dubai"
  | "realization"
  | "declaration"
  | "proposal"
  | "accepted"
  | "talk";

export default function Home() {
  const [stage, setStage] = useState<Stage>("intro");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const audioRef = useRef<HTMLAudioElement>(null);

  const hearts = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: `${3 + ((index * 17) % 94)}%`,
        delay: (index % 10) * 0.12,
        duration: 3 + (index % 6) * 0.4,
        size: 14 + (index % 7) * 5,
        drift: ((index % 7) - 3) * 24,
        filled: index % 3 === 0,
      })),
    []
  );

  const proposalHearts = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => ({
        id: index,
        left: `${2 + ((index * 23) % 96)}%`,
        delay: (index % 12) * 0.3,
        duration: 5 + (index % 7) * 0.6,
        size: 12 + (index % 8) * 5,
        drift: ((index % 9) - 4) * 18,
        filled: index % 2 === 0,
      })),
    []
  );

  useEffect(() => {
    if (stage !== "hearts") return;

    const timer = setTimeout(() => {
      setStage("home");
    }, 4200);

    return () => clearTimeout(timer);
  }, [stage]);

  const startProposal = async () => {
    try {
      if (audioRef.current) {
        audioRef.current.volume = 0.5;
        await audioRef.current.play();
      }
    } catch (error) {
      console.log("Audio playback blocked:", error);
    }

    setStage("proposal");
  };

  const submitProposalResponse = async (
    response: "yes" | "talk"
  ) => {
    if (submitting) return;

    setSubmitting(true);
    setSubmitError("");

    const { error } = await supabase
      .from("proposal_responses")
      .insert({
        response,
      });

      if (error) {
  console.error("SUPABASE ERROR:", error);

  setSubmitError(
    `${error.message} (${error.code})`
  );

  setSubmitting(false);
  return;
}
  

    if (response === "yes") {
      setStage("accepted");
    } else {
      setStage("talk");
    }

    setSubmitting(false);
  };

  const PrimaryButton = ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <motion.button
      whileHover={{
        scale: 1.03,
        boxShadow: "0 0 45px rgba(140,38,59,0.22)",
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group mx-auto flex min-h-14 items-center justify-center gap-3 rounded-xl border border-[#713047] bg-[#2b1017]/80 px-7 py-4 text-sm font-semibold tracking-[0.08em] text-[#f5e7e0] transition hover:border-[#a7445c] hover:bg-[#3a121d]"
    >
      {children}

      <ArrowRight
        size={17}
        className="transition-transform group-hover:translate-x-1"
      />
    </motion.button>
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090708] text-[#f7efe9]">
      <audio
        ref={audioRef}
        src="/music/proposal.mp3"
        loop
        preload="auto"
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-18%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#50111d]/20 blur-[150px]" />
        <div className="absolute bottom-[-18%] right-[-8%] h-[420px] w-[420px] rounded-full bg-[#3d0d16]/20 blur-[130px]" />
        <div className="absolute left-[-12%] top-[30%] h-[300px] w-[300px] rounded-full bg-[#2d0c13]/20 blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <motion.section
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16"
          >
            <div className="mx-auto w-full max-w-2xl text-center">
              <p className="mb-6 text-[11px] uppercase tracking-[0.42em] text-[#bca9a2]">
                Something I made only for you
              </p>

              <h1 className="font-serif text-6xl sm:text-7xl">
                Bertila<span className="text-[#a4384d]">.</span>
              </h1>

              <div className="mx-auto mt-10 max-w-xl space-y-5 text-base leading-8 text-[#d8ccc6] sm:text-lg">
                <p>
                  For the past{" "}
                  <span className="text-white">one month</span>, I&apos;ve been
                  building something quietly.
                </p>

                <p className="text-sm text-[#9f918c]">
                  Writing. Deleting. Starting again.
                </p>

                <p>
                  Not because I didn&apos;t know what I wanted to say...
                </p>

                <p>
                  but because I wanted to find the right way to say it.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStage("permission")}
                className="mx-auto mt-12 flex min-h-16 items-center justify-center gap-3 rounded-2xl border border-[#8f2a40] bg-gradient-to-r from-[#4a111d] to-[#711c2f] px-8 py-4 text-sm font-semibold text-white"
              >
                I made this for you
                <Heart size={18} />
              </motion.button>
            </div>
          </motion.section>
        )}

        {stage === "permission" && (
          <motion.section
            key="permission"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex min-h-screen items-center justify-center px-6"
          >
            <div className="max-w-xl text-center">
              <Heart
                size={28}
                className="mx-auto mb-8 text-[#c44a61]"
              />

              <h2 className="font-serif text-3xl leading-relaxed sm:text-4xl">
                Before you continue,
                <br />
                I want just a few minutes of your time.
              </h2>

              <p className="mt-8 text-[#b9aaa4]">
                Will you allow me to show you what has been in my heart?
              </p>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setStage("hearts")}
                className="mx-auto mt-10 flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#8e263e] to-[#b23c55] px-9 py-4 font-bold text-white"
              >
                YES, SHOW ME
                <Heart size={18} fill="currentColor" />
              </motion.button>
            </div>
          </motion.section>
        )}

        {stage === "hearts" && (
          <motion.section
            key="hearts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden px-6"
          >
            {hearts.map((heart) => (
              <motion.div
                key={heart.id}
                initial={{
                  y: "55vh",
                  opacity: 0,
                  scale: 0.3,
                }}
                animate={{
                  y: "-65vh",
                  x: heart.drift,
                  opacity: [0, 0.9, 0.7, 0],
                }}
                transition={{
                  duration: heart.duration,
                  delay: heart.delay,
                }}
                style={{
                  position: "absolute",
                  left: heart.left,
                  bottom: 0,
                }}
              >
                <Heart
                  size={heart.size}
                  className="text-[#c94d65]"
                  fill={heart.filled ? "currentColor" : "none"}
                />
              </motion.div>
            ))}

            <div className="relative z-20 text-center">
              <Heart
                size={40}
                fill="currentColor"
                className="mx-auto mb-7 text-[#b43a52]"
              />

              <h2 className="font-serif text-4xl">
                Thank you, Bertila.
              </h2>

              <p className="mt-5 text-[#c5b6b0]">
                Come with me...
              </p>
            </div>
          </motion.section>
        )}

        {stage === "home" && (
          <motion.section
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex min-h-screen items-center justify-center px-6"
          >
            <div className="max-w-2xl text-center">
              <p className="mb-5 text-[11px] uppercase tracking-[0.45em] text-[#8e7c76]">
                Where it started
              </p>

              <h2 className="font-serif text-4xl sm:text-6xl">
                Before Douala.
                <br />
                Before Dubai.
              </h2>

              <div className="mt-9 space-y-5 text-lg leading-8 text-[#b9aaa4]">
                <p>Before life carried us in different directions,</p>

                <p className="font-serif text-2xl text-[#eee1d9]">
                  we came from the same place.
                </p>

                <p>
                  We were simply two young people growing up, with no idea where
                  life would eventually take us.
                </p>
              </div>

              <p className="mt-8 font-serif text-3xl">
                There was home.
              </p>

              <div className="mt-12">
                <PrimaryButton onClick={() => setStage("bamenda")}>
                  Continue our story
                </PrimaryButton>
              </div>
            </div>
          </motion.section>
        )}

        {stage === "bamenda" && (
          <motion.section
            key="bamenda"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16"
          >
            <div className="max-w-2xl text-center">
              <Sparkles
                size={22}
                className="mx-auto mb-6 text-[#bf6b7e]"
              />

              <p className="mb-5 text-[11px] uppercase tracking-[0.45em] text-[#8e7c76]">
                Bamenda
              </p>

              <h2 className="font-serif text-4xl sm:text-6xl">
                I watched you grow.
              </h2>

              <div className="mt-10 space-y-5 text-lg leading-8 text-[#d7c9c4]">
                <p>I watched you go to school.</p>
                <p>I watched you work.</p>
                <p>I watched you roast fish and sell.</p>

                <p className="pt-4 font-serif text-2xl text-[#f0e2db]">
                  We were both still growing.
                  <br />
                  Still trying to become something.
                </p>
              </div>

              <div className="mt-10">
                <PrimaryButton onClick={() => setStage("douala")}>
                  Then came Douala
                </PrimaryButton>
              </div>
            </div>
          </motion.section>
        )}

        {stage === "douala" && (
          <motion.section
            key="douala"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 min-h-screen px-6 py-12"
          >
            <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-10 lg:grid-cols-2">
              <div className="order-2 text-center lg:order-1 lg:text-left">
                <div className="mb-5 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.4em] text-[#9f8680] lg:justify-start">
                  <MapPin size={14} />
                  Douala · 2023
                </div>

                <h2 className="font-serif text-4xl sm:text-6xl">
                  And then I met you again.
                </h2>

                <p className="mt-8 text-lg text-[#c5b6b0]">
                  This time, I didn&apos;t just see the girl I grew up knowing.
                </p>

                <p className="mt-3 font-serif text-3xl">
                  I saw a woman.
                </p>

                <div className="mt-9 space-y-3 text-[#b6a7a1]">
                  <p>You gave me your time.</p>
                  <p>Your free moments.</p>
                  <p>Your nights.</p>
                  <p>Your friendship.</p>
                </div>

                <p className="mt-8 font-serif text-2xl">
                  And somehow, you became one of the most valuable people in my
                  life.
                </p>

                <div className="mt-10">
                  <PrimaryButton onClick={() => setStage("more")}>
                    There was something more
                  </PrimaryButton>
                </div>
              </div>

              <div className="order-1 mx-auto w-full max-w-[520px] lg:order-2">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10">
                  <Image
                    src="/images/bertila.jpg"
                    alt="Bertila"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 520px"
                    className="object-cover object-center brightness-[0.88]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#090708] via-transparent to-transparent" />

                  <div className="absolute bottom-0 p-7">
                    <p className="font-serif text-2xl">
                      The girl I knew...
                    </p>

                    <p className="mt-2 text-sm text-white/65">
                      had become someone I could no longer see the same way.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {stage === "more" && (
          <motion.section
            key="more"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16"
          >
            <div className="max-w-2xl text-center">
              <Heart
                size={28}
                className="mx-auto mb-7 text-[#a84459]"
              />

              <p className="text-[11px] uppercase tracking-[0.42em] text-[#8e7c76]">
                More than attraction
              </p>

              <h2 className="mt-5 font-serif text-4xl sm:text-6xl">
                You became more than a moment.
              </h2>

              <div className="mt-10 space-y-6 text-lg leading-8 text-[#c6b8b2]">
                <p>We became close.</p>

                <p>
                  There were moments when affection could have become something
                  temporary.
                </p>

                <p className="font-serif text-2xl text-[#f3e4dc]">
                  But something in me kept saying...
                </p>

                <p className="font-serif text-3xl text-white">
                  Bertila is worth more than a moment.
                </p>

                <p>
                  I respected what you were comfortable with.
                </p>

                <p>
                  And somewhere in that closeness, I realized what I felt was
                  not about sex.
                </p>

                <p className="font-serif text-3xl text-[#f4e5de]">
                  It was about you.
                </p>
              </div>

              <div className="mt-12">
                <PrimaryButton onClick={() => setStage("dubai")}>
                  Then life took me away
                </PrimaryButton>
              </div>
            </div>
          </motion.section>
        )}

        {stage === "dubai" && (
          <motion.section
            key="dubai"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 min-h-screen px-6 py-12"
          >
            <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-12 lg:grid-cols-2">
              <div className="relative mx-auto flex w-full items-center justify-center">
                <div className="absolute h-[330px] w-[330px] rounded-full bg-[#6d2335]/20 blur-[60px]" />

                <div className="relative h-[290px] w-[290px] overflow-hidden rounded-full border border-white/15 sm:h-[350px] sm:w-[350px]">
                  <Image
                    src="/images/kelvin2.jpg"
                    alt="Kelvin"
                    fill
                    priority
                    sizes="350px"
                    className="object-cover object-[50%_20%] brightness-[0.9]"
                  />
                </div>
              </div>

              <div className="text-center lg:text-left">
                <div className="mb-5 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.4em] text-[#8d98a9] lg:justify-start">
                  <Plane size={15} />
                  Dubai
                </div>

                <h2 className="font-serif text-4xl sm:text-6xl">
                  Then life carried me far away.
                </h2>

                <div className="mt-9 space-y-5 text-lg leading-8 text-[#b9bbc2]">
                  <p>Distance changed many things.</p>

                  <p>But one thing didn&apos;t disappear.</p>

                  <p className="font-serif text-3xl text-white">
                    You.
                  </p>

                  <p>
                    Even from Dubai, you kept standing with me.
                  </p>

                  <p>You remained part of my life.</p>

                  <p>
                    And instead of distance weakening what I felt...
                  </p>

                  <p className="font-serif text-2xl text-[#f0e5df]">
                    it made me understand it.
                  </p>
                </div>

                <div className="mt-10">
                  <PrimaryButton
                    onClick={() => setStage("realization")}
                  >
                    There is something I finally understand
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {stage === "realization" && (
          <motion.section
            key="realization"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex min-h-screen items-center justify-center px-6"
          >
            <div className="max-w-3xl text-center">
              <Heart
                size={24}
                fill="currentColor"
                className="mx-auto mb-8 text-[#b44058]"
              />

              <p className="text-[10px] uppercase tracking-[0.5em] text-[#8f7974]">
                I finally understand
              </p>

              <p className="mt-10 text-lg text-[#b9aaa5]">
                It took me one month to build this.
              </p>

              <h2 className="mx-auto mt-8 max-w-2xl font-serif text-4xl leading-[1.25] sm:text-6xl">
                But it took me years to understand why my heart kept coming
                back to you.
              </h2>

              <p className="mt-10 leading-8 text-[#ad9e99]">
                Through distance.
                <br />
                Through time.
                <br />
                Through everything life changed.
              </p>

              <p className="mt-12 font-serif text-4xl text-[#f7e8df]">
                I know what I want now.
              </p>

              <div className="mt-12">
                <PrimaryButton
                  onClick={() => setStage("declaration")}
                >
                  Let me tell you
                </PrimaryButton>
              </div>
            </div>
          </motion.section>
        )}

        {stage === "declaration" && (
          <motion.section
            key="declaration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16"
          >
            <div className="max-w-3xl text-center">
              <p className="text-[10px] uppercase tracking-[0.5em] text-[#8d7772]">
                From my heart
              </p>

              <h2 className="mt-6 font-serif text-5xl sm:text-7xl">
                Bertila.
              </h2>

              <div className="mx-auto mt-10 max-w-2xl space-y-6 text-base leading-8 text-[#c7b8b2]">
                <p>I know where we came from.</p>

                <p>
                  I have seen parts of your struggle.
                  <br />
                  You have seen parts of mine.
                </p>

                <p className="font-serif text-2xl text-[#f1e2da]">
                  We have watched each other grow.
                </p>

                <p>
                  I don&apos;t want to spend my life searching for another woman
                  while my heart already knows who it wants to build with.
                </p>

                <p className="font-serif text-3xl text-white">
                  I don&apos;t want something temporary with you.
                </p>

                <div className="space-y-2 font-serif text-2xl text-[#eadbd4]">
                  <p>I want peace.</p>
                  <p>A home.</p>
                  <p>Growth.</p>
                  <p>Laughter.</p>
                </div>

                <p>
                  Hard days we survive together.
                  <br />
                  Good days we celebrate together.
                </p>

                <p>
                  I want to support the woman you are becoming.
                </p>

                <p>
                  And I want you beside the man I am becoming.
                </p>

                <p className="font-serif text-3xl text-[#f7e8df]">
                  I love you.
                  <br />
                  And I am ready to build a life with you.
                </p>
              </div>

              <div className="mt-12">
                <PrimaryButton onClick={startProposal}>
                  There is one last thing...
                </PrimaryButton>
              </div>
            </div>
          </motion.section>
        )}

        {stage === "proposal" && (
          <motion.section
            key="proposal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden px-6 py-16"
          >
            <div className="absolute inset-0">
              <Image
                src="/images/bertila.jpg"
                alt="Bertila"
                fill
                priority
                sizes="100vw"
                className="scale-105 object-cover object-center brightness-[0.22]"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-[#090708]/80 via-[#250a12]/60 to-[#090708]/95" />
            </div>

            {proposalHearts.map((heart) => (
              <motion.div
                key={heart.id}
                initial={{
                  y: "110vh",
                  opacity: 0,
                }}
                animate={{
                  y: "-25vh",
                  x: heart.drift,
                  opacity: [0, 0.65, 0.5, 0],
                }}
                transition={{
                  duration: heart.duration,
                  delay: heart.delay,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  position: "absolute",
                  left: heart.left,
                  bottom: -80,
                }}
                className="z-10"
              >
                <Heart
                  size={heart.size}
                  className="text-[#d85a72]"
                  fill={heart.filled ? "currentColor" : "none"}
                />
              </motion.div>
            ))}

            <div className="relative z-20 mx-auto max-w-3xl text-center">
              <Heart
                size={38}
                fill="currentColor"
                className="mx-auto mb-8 text-[#d04b65]"
              />

              <p className="font-serif text-3xl">
                Bertila...
              </p>

              <div className="mx-auto mt-8 max-w-xl space-y-4 text-base leading-8 text-[#d5c7c1]">
                <p>We didn&apos;t meet yesterday.</p>

                <p>We grew into this.</p>

                <p>
                  From the same village,
                  <br />
                  to Bamenda,
                  <br />
                  to Douala,
                  <br />
                  to Dubai...
                </p>

                <p>
                  and somehow, my heart kept finding its way back to you.
                </p>

                <p className="font-serif text-2xl text-white">
                  I don&apos;t want another temporary chapter with you.
                </p>

                <p className="font-serif text-3xl text-[#f8e7df]">
                  I want the rest of the story.
                </p>
              </div>

              <motion.h1
                animate={{
                  textShadow: [
                    "0 0 20px rgba(210,75,101,0.15)",
                    "0 0 45px rgba(210,75,101,0.45)",
                    "0 0 20px rgba(210,75,101,0.15)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="mt-12 font-serif text-5xl leading-tight text-white sm:text-7xl"
              >
                Will you marry me?
              </motion.h1>

              <Heart
                size={38}
                fill="currentColor"
                className="mx-auto mt-7 text-[#d84d68]"
              />

              <div className="mx-auto mt-12 flex max-w-lg flex-col gap-4 sm:flex-row">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  disabled={submitting}
                  onClick={() =>
                    submitProposalResponse("yes")
                  }
                  className="flex min-h-16 flex-1 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#a22d47] to-[#d54b66] px-7 py-4 text-sm font-bold text-white disabled:opacity-60"
                >
                  {submitting
                    ? "SAVING..."
                    : "YES, I WILL"}

                  <Heart
                    size={19}
                    fill="currentColor"
                  />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={submitting}
                  onClick={() =>
                    submitProposalResponse("talk")
                  }
                  className="flex min-h-16 flex-1 items-center justify-center gap-3 rounded-2xl border border-white/20 bg-black/30 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md disabled:opacity-60"
                >
                  I WANT US TO TALK
                  <MessageCircleHeart size={19} />
                </motion.button>
              </div>

              {submitError && (
                <p className="mt-5 text-sm text-[#ef9aa9]">
                  {submitError}
                </p>
              )}
            </div>
          </motion.section>
        )}

        {stage === "accepted" && (
          <motion.section
            key="accepted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden px-6"
          >
            {proposalHearts.map((heart) => (
              <motion.div
                key={`accepted-${heart.id}`}
                initial={{
                  y: "50vh",
                  opacity: 0,
                }}
                animate={{
                  y: "-70vh",
                  x: heart.drift,
                  opacity: [0, 1, 0.8, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                }}
                style={{
                  position: "absolute",
                  left: heart.left,
                  bottom: -60,
                }}
              >
                <Heart
                  size={heart.size + 7}
                  fill="currentColor"
                  className="text-[#dc5570]"
                />
              </motion.div>
            ))}

            <div className="relative z-20 max-w-3xl text-center">
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                <Heart
                  size={68}
                  fill="currentColor"
                  className="mx-auto text-[#d84d68]"
                />
              </motion.div>

              <h1 className="mt-9 font-serif text-5xl sm:text-7xl">
                You just made me
                <br />
                the happiest man alive.
              </h1>

              <p className="mt-9 text-lg leading-8 text-[#cdbdb7]">
                From the same village,
                <br />
                to Bamenda,
                <br />
                to Douala,
                <br />
                to Dubai...
              </p>

              <p className="mt-6 font-serif text-3xl text-[#f7e8df]">
                and now, toward forever.
              </p>

              <p className="mt-8 text-5xl">
                ❤️
              </p>
            </div>
          </motion.section>
        )}

        {stage === "talk" && (
          <motion.section
            key="talk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex min-h-screen items-center justify-center px-6"
          >
            <div className="max-w-xl text-center">
              <MessageCircleHeart
                size={40}
                className="mx-auto text-[#c84e67]"
              />

              <h1 className="mt-8 font-serif text-4xl sm:text-6xl">
                I&apos;ll be here.
              </h1>

              <p className="mt-7 text-lg leading-8 text-[#c3b4ae]">
                Some things deserve a real conversation.
              </p>

              <p className="mt-6 font-serif text-2xl text-[#f1e2da]">
                Whatever you want to say, I want to hear you.
              </p>

              <Heart
                size={24}
                fill="currentColor"
                className="mx-auto mt-9 text-[#c74d66]"
              />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}