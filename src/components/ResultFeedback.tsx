import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import type { ReviewedAnswer } from "../types/UserAnswer";

interface ResultFeedbackProps {
  review: ReviewedAnswer;
}

export default function ResultFeedback({ review }: ResultFeedbackProps) {
  const perfect = review.score === review.maxScore;
  const Icon = perfect ? CheckCircle2 : XCircle;

  return (
    <motion.div
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`rounded-lg border p-5 text-center shadow-stadium ${
        perfect ? "border-mundialGold bg-mundialGreen/22" : "border-mundialRed/70 bg-mundialRed/18"
      }`}
    >
      <motion.div
        className={`mx-auto mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full ${perfect ? "bg-mundialGold text-midnight" : "bg-white text-mundialRed"}`}
        animate={perfect ? { rotate: [0, -8, 8, 0], scale: [1, 1.1, 1] } : { x: [0, -4, 4, 0] }}
        transition={{ duration: 0.65 }}
      >
        <Icon size={34} />
      </motion.div>
      <h2 className="text-2xl font-black uppercase text-white">{review.message}</h2>
      <p className="mt-2 text-sm font-bold text-white/72">
        Sumaste {review.score} de {review.maxScore} puntos en este partido.
      </p>
    </motion.div>
  );
}
