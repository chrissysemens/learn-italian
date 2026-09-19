# Italian Learning Ladder (CEFR A1-C2)

## Purpose

This curriculum is designed for a stateful tutoring agent. The agent
should use the learner's current CEFR level file as the source of truth
for teaching, practice, testing, error diagnosis, and promotion.

## Agent workflow

1.  Read the learner's persisted state and current CEFR level.
2.  Read the corresponding syllabus file (`A1.md` ... `C2.md`).
3.  Select the next incomplete competency rather than teaching the whole
    level linearly.
4.  Teach briefly, then require active production.
5.  Test recognition, controlled production, free production, reading,
    listening (when audio is available), and interaction.
6.  Record demonstrated competencies, recurring errors, vocabulary
    weaknesses, and review dates.
7.  Recycle recurring errors using spaced practice.
8.  Do not mark a competency mastered from one lucky answer.
9.  Promote only when the learner meets the exit criteria across the
    level, not merely when grammar topics have been 'covered'.

## Levels

  -----------------------------------------------------------------------
  Level                   Working description     Outcome
  ----------------------- ----------------------- -----------------------
  A1                      Beginner / Breakthrough Survive simple
                                                  predictable exchanges
                                                  and communicate basic
                                                  personal information.

  A2                      Elementary / Waystage   Handle routine
                                                  situations and describe
                                                  familiar people,
                                                  places, habits and past
                                                  events.

  B1                      Intermediate /          Function independently
                          Threshold               in most everyday
                                                  situations and sustain
                                                  connected conversation.

  B2                      Upper-intermediate /    Interact spontaneously,
                          Vantage                 argue a viewpoint and
                                                  understand most
                                                  standard media and
                                                  discussion.

  C1                      Advanced / Effective    Use Italian flexibly
                          Operational Proficiency and precisely for
                                                  social, academic and
                                                  professional purposes.

  C2                      Mastery                 Understand virtually
                                                  everything encountered
                                                  and express fine
                                                  distinctions naturally
                                                  and precisely.
  -----------------------------------------------------------------------

## Persisted learner state (suggested)

``` yaml
current_level: A1
competencies:
  a1.present_regular_verbs:
    status: learning   # unseen | learning | review | mastered
    evidence_count: 2
    last_tested: null
recurring_errors:
  - id: article_gender
    examples: []
vocabulary:
  known: []
  learning: []
review_queue: []
speaking_notes: []
promotion_history: []
```

## Mastery model

A competency is normally `mastered` only after correct use in multiple
contexts on separate attempts. The agent should distinguish: -
**Recognition:** learner can identify the correct form. - **Controlled
production:** learner can produce it when prompted. - **Free
production:** learner uses it correctly without being told which
structure is needed. - **Interaction:** learner can use it while
maintaining a conversation.

A grammar point is not fully mastered if the learner can complete a
multiple-choice question but consistently avoids or misuses it in free
speech.

## Promotion

Before promotion, run a mixed checkpoint that samples the entire current
syllabus. Prefer open-ended tasks over multiple choice. A learner should
demonstrate: - broad coverage of the level's core competencies; -
reliable performance rather than perfection; - ability to recover from
misunderstandings; - no recurring foundational error severe enough to
undermine the next level.

When uncertain, keep the learner at the current level but teach from the
boundary with the next level.
