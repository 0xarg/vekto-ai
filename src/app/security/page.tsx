import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Pending } from "@/components/ui/pending";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata = buildMetadata({
  title: "Security & trust",
  description:
    "Where VektoForge runs, how customer source code is handled, what is retained and for how long, and the certifications Vekto AI holds.",
  path: "/security",
});

/** The questions every enterprise security review asks. Answers come from the
 *  client; the questions themselves are stable and safe to publish. */
const questions = [
  {
    question: "Where do the agents run?",
    topic: "Deployment model — our cloud, customer VPC, or on-premise.",
  },
  {
    question: "Does our source code leave our network?",
    topic: "Data egress boundary and what is transmitted.",
  },
  {
    question: "How long is our data retained?",
    topic: "Retention period and deletion process.",
  },
  {
    question: "Is our code used to train models?",
    topic: "Training data policy. This is usually the deciding question.",
  },
  {
    question: "Which certifications do you hold?",
    topic: "SOC 2, ISO 27001, or the current status of each.",
  },
  {
    question: "Who on your side can access our estate?",
    topic: "Access control, least privilege, and audit logging.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trust"
        title="Where your code runs, and who can see it."
        lede="Migration means handing over the source of systems that run your business. These are the questions your security team will ask, answered directly."
        crumbs={[{ name: "Security & trust", path: "/security" }]}
      />

      <Section bordered={false}>
        <Pending
          className="mb-10"
          item="Answers to all six security questions below, plus certification status"
          due="15 Sep"
          note="This is the single most common reason an enterprise buyer disengages. Until these are answered the page publishes the questions without answers, which is worse than not shipping it — so this page stays out of the launch set if the answers do not arrive."
        />

        <dl className="border-rule divide-rule divide-y border-y">
          {questions.map((q) => (
            <div
              key={q.question}
              className="grid gap-4 py-8 md:grid-cols-[1fr_1.4fr] md:gap-10"
            >
              <dt className="font-serif text-lg">{q.question}</dt>
              <dd className="text-ink-faint font-mono text-xs">
                Awaiting answer — {q.topic}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <CtaBand
        heading="Need to run this past your security team?"
        lede="We can join a security review directly and answer questions against your control framework rather than a generic questionnaire."
      />
    </>
  );
}
