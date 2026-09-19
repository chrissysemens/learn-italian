# Italian CEFR Agent Curriculum

Files: - `learning-ladder.md`: progression logic, state model and
promotion principles. - `A1.md` ... `C2.md`: level-specific teaching,
testing, common-error and exit criteria.

The files intentionally describe competencies rather than fixed lessons
so an agent can adapt sequencing to persisted learner state.

Recommended retrieval pattern: 1. Load `learning-ladder.md`. 2. Load
learner state. 3. Load only the current level syllabus. 4. Select
incomplete/due competencies. 5. Teach/test. 6. Persist evidence and
recurring errors. 7. Run a cumulative checkpoint before promotion.

Important: CEFR is a proficiency framework, not a single mandated
grammar syllabus. The contents here are a practical Italian curriculum
mapped to the progression, with mastery heuristics for an adaptive
tutor.
