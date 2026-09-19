# Confidence model TODO

Current limitation accepted for now:

- Ten identical easy questions could theoretically produce `confidence: 1`.

Future improvement:

- Make confidence account for question variety.
- Make confidence account for time, including spacing and recency of attempts.

# Learner identification TODO

Current testing limitation:

- The learner ID is hardcoded for testing with one learner.
- Replace this with dynamic learner identification.

# Error feedback UI

- Highlight the exact learner text associated with each `DetectedError.range`.
- Use the same visual identifier/colour for the highlighted text and its feedback item.
- Allow multiple independently highlighted errors in one answer.
- Validate that `answer.slice(range.start, range.end)` matches `learnerForm`.
- Consider interaction later: tapping an error highlights/scrolls to its corresponding explanation.
- For an entirely incorrect/non-responsive answer, show answer-level feedback rather than artificially annotating every word.

# Learner error history TODO

Current approach:

- A persistent `LearnerError` represents an underlying recurring problem.
- Match recurring errors using `competencyId + errorType`.
- `learnerForm`, `correctedForm`, and `explanation` represent the most recent occurrence.
- Increment `occurrences` when the same underlying error is detected again.

Future improvement:

- Consider storing individual error occurrences/history for analytics and learning insights.
- Preserve previous learner forms and corrections if historical examples become useful.
- Consider whether error recurrence should account for time/spacing when determining `active`, `improving`, and `resolved`.

# Unmapped learner errors TODO

Current approach:

- `DetectedError.competencyId` is optional.
- Errors associated with a competency can be tracked as recurring learner errors using `competencyId + errorType`.
- Errors without a `competencyId` can still be shown to the learner as feedback but are not persisted as recurring competency errors.

Future improvement:

- Decide whether non-competency errors such as spelling should also be persisted and tracked over time.
- If so, define a stable identity/matching strategy for those errors.

# Learner error evidence TODO

V1 heuristic:

- Positive competency evidence plus absence of a particular error is a reasonable heuristic for now.

Future improvement:

- A competency may have several error types, and demonstrating the competency does not always prove that a particular historical error was tested.
- Let evaluator or exercise metadata explicitly identify which error rules an attempt provided evidence against.
- Give error lifecycle its own pure state transition function rather than putting the logic directly in `LearningService`.