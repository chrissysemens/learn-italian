# Must Have

These are required for a coherent V1 learning loop. Build them in roughly this order.

## 1. Curriculum and learner identity

### A1 error rule taxonomy

Populate competency-specific `errorRules` for the A1 curriculum.

- Keep rule IDs stable once learner errors can be persisted against them.
- Rules should describe distinct, trackable mistakes rather than generic "wrong answer" categories.
- Avoid duplicating the same semantic error under multiple rules.
- Review rules alongside the real evaluator implementation.

### Learner identification

Current testing limitation:

- The learner ID is hardcoded for testing with one learner.
- Replace this with dynamic learner identification before supporting multiple real learners.

## 2. Core learning surface

### Main learning surface

- Keep the primary exercise screen minimal and paper-like: white, greys, restrained typography, and soft transitions.
- Avoid gamified visual noise, cartoon characters, bright colours, and large action buttons.
- Give each exercise type its own presentation component while sharing the same minimal shell.
- Keep header navigation minimal: menu, journal, and progress.

### Visual direction

- Draw inspiration from restrained instrument interfaces: generous negative space, thin line-work, simple geometry, and tactile matte surfaces.
- Use a warm, paper-like reading surface rather than a conventional app/dashboard aesthetic.
- Integrate controls into the surface so they do not feel like conventional buttons.
- Use texture extremely subtly; readability and calm take priority over decorative effects.
- Allow exercise types to have distinct compositions while sharing the same visual language.

### Answer focus mode

- Tapping the answer area transitions into a dedicated answering state.
- Hide non-essential screen content while the keyboard is open.
- Centre the answer area in the usable space above the keyboard.
- Pressing Return submits the answer and dismisses the keyboard.
- Do not provide an explicit submit button.
- Treat the transition as a first-class UX interaction rather than relying only on default text-input/keyboard behaviour.

### Icon interactions

- Use small monochrome icons for primary actions rather than conventional buttons.
- Use a chalkboard-style icon for Learn and a skipping-rope-style icon for Skip.
- Show explanatory labels during the learner's initial experience; allow labels to disappear once familiar.
- Long press reveals an icon label without performing the action.
- Normal tap performs the action.
- Provide accessibility labels independently of visible labels.

## 3. Answer feedback and attempt state

### Error feedback UI

- Highlight the exact learner text associated with each `DetectedError.range`.
- Use the same visual identifier/colour for the highlighted text and its feedback item.
- Allow multiple independently highlighted errors in one answer.
- Validate that `answer.slice(range.start, range.end)` matches `learnerForm`.
- For an entirely incorrect/non-responsive answer, show answer-level feedback rather than artificially annotating every word.

### Assisted attempts

Answers submitted after "Teach me" are assisted attempts.

- Replace the hardcoded `assisted` value in the test harness with UI-owned attempt state.
- Selecting Learn marks the current exercise attempt as assisted.
- Returning from the lesson preserves the assisted state for the original exercise.
- Evaluate them and show normal linguistic feedback.
- Do not update mastery or confidence.
- Do not count them as evidence that a recurring error is improving/resolved.
- Starting or skipping to a new exercise resets assisted state to `false`.
- Retest later with a fresh unassisted exercise.

### Skip

- Skipping an exercise is not negative mastery evidence.
- Skip abandons the current exercise without evaluation or learner-state updates.
- Starting the next exercise resets assisted state to `false`.
- When usage limits are introduced, generating an exercise consumes usage; skipping neither refunds nor consumes an additional unit.

## 4. Teach Me and journal foundation

### Teach Me / lesson mode

- Each exercise can offer "Teach me this".
- Remove the current exercise from view and generate a short, targeted lesson for what is needed to understand it without revealing its answer.
- Lesson generation receives the actual exercise and relevant curriculum context.
- Keep lesson generation separate from exercise generation/evaluation.
- A small back action restores the original exercise and its state.
- Do not visually penalise or label the learner for requesting help.
- Later test the competency independently with a fresh exercise.

Potential contract:

- `LessonGenerator`
- `GenerateLessonRequest`
- `Lesson`
- Consider renaming `NewLesson` to better reflect its role as lesson creation input.

### Learning Journal

- Persist every generated Teach Me lesson.
- Treat lessons as immutable historical artifacts: revisiting a lesson shows the original lesson rather than regenerated content.
- Give each learner's lessons a monotonically increasing sequence number: Lesson 1, Lesson 2, ...
- Keep the sequence number as presentation/domain data; it does not need to be the Firestore document ID.
- Open the journal on the learner's most recent lesson.
- Support simple previous/next navigation through lesson history.
- Communicate the learner's journey by keeping old lessons visible even after they become easy.

### Lesson persistence implementation

- Return to replace the mocked `FsLessonRepo` implementation with Firestore persistence, including transactional sequence assignment and latest/sequence-based lesson retrieval.

## 5. Learning-state integrity

### Current learner-error approach

- A persistent `LearnerError` represents an underlying recurring problem.
- Match recurring errors using `competencyId + errorType`.
- `learnerForm`, `correctedForm`, and `explanation` represent the most recent occurrence.
- Increment `occurrences` when the same underlying error is detected again.

### Unmapped learner errors

- `DetectedError.competencyId` is optional.
- Errors associated with a competency can be tracked as recurring learner errors using `competencyId + errorType`.
- Errors without a `competencyId` can still be shown to the learner as feedback but are not persisted as recurring competency errors.

### Learner error evidence

V1 heuristic:

- Positive competency evidence plus absence of a particular error is a reasonable heuristic for now.

## 6. Usage and subscriptions before commercial launch

- Support free and paid access tiers.
- Give free learners a configurable daily learning allowance.
- Keep the allowance configurable rather than hardcoding values such as 10, 15, or 20 in learning-domain logic.
- Consume free-tier allowance when a new AI-generated exercise is created, not when it is answered.
- Do not consume an additional unit when skipping; the skipped exercise has already consumed its generation unit.
- Give paid learners a substantially higher or effectively unlimited learner-facing allowance.
- Keep usage and billing separate from mastery, confidence, and learner progression.
- Add server-side usage enforcement before commercial launch; do not trust client-side counters.
- Consider separate internal abuse and cost controls for Teach Me, evaluation, and other model operations without exposing API-call accounting to the learner.
- Determine final allowances and paid pricing from measured real-world model usage and costs during testing.

# Should Have

These improve quality, maintainability, or insight after the core loop is working.

## Confidence model

Current limitation accepted for now:

- Ten identical easy questions could theoretically produce `confidence: 1`.

Future improvement:

- Make confidence account for question variety.
- Make confidence account for time, including spacing and recency of attempts.

## Error feedback interaction

- Consider interaction later: tapping an error highlights or scrolls to its corresponding explanation.

## Learner error history

- Consider storing individual error occurrences/history for analytics and learning insights.
- Preserve previous learner forms and corrections if historical examples become useful.
- Consider whether error recurrence should account for time/spacing when determining `active`, `improving`, and `resolved`.

## Learner error evidence refinement

- A competency may have several error types, and demonstrating the competency does not always prove that a particular historical error was tested.
- Let evaluator or exercise metadata explicitly identify which error rules an attempt provided evidence against.
- Give error lifecycle its own pure state transition function rather than putting the logic directly in `LearningService`.

# Could Have

These are useful experiments or analytics once the product has real usage data.

## Unmapped learner errors

- Decide whether non-competency errors such as spelling should also be persisted and tracked over time.
- If so, define a stable identity/matching strategy for those errors.

## Skip analytics

- Consider tracking skip frequency separately as learner/product analytics later.

# Won't Have Yet

Explicitly defer these from V1 to keep the product focused.

- Journal folders, categories, search, or other library-style UI.
- Treating skipped exercises as learner-state evidence; skips remain separate product analytics only.