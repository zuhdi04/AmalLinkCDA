import { useEffect, useState, useRef } from 'react';
import type { Program, ProgramQuestion } from '../types/program';
import { fetchProgramQuestions, submitRegistration, formatEventDate } from '../services/programService';

interface RegistrationModalProps {
  program: Program | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RegistrationModal({ program, isOpen, onClose }: RegistrationModalProps) {
  const [questions, setQuestions] = useState<ProgramQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen || !program) {
      setQuestions([]);
      setFullName('');
      setEmail('');
      setPhone('');
      setAnswers({});
      setSubmitError(null);
      setIsSuccess(false);
      return;
    }

    let isMounted = true;
    setLoadingQuestions(true);
    setQuestionsError(null);

    fetchProgramQuestions(program.id)
      .then((data) => {
        if (!isMounted) return;
        setQuestions(data);
        const initialAnswers: Record<string, string> = {};
        data.forEach((q) => {
          initialAnswers[q.id] = '';
        });
        setAnswers(initialAnswers);
      })
      .catch((err) => {
        if (!isMounted) return;
        setQuestionsError(err instanceof Error ? err.message : 'Could not load form questions.');
      })
      .finally(() => {
        if (isMounted) setLoadingQuestions(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, program]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
        )
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    const focusTimer = window.setTimeout(() => {
      (firstInputRef.current ?? modalRef.current)?.focus();
    }, 50);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !program) return null;

  function handleAnswerChange(questionId: string, value: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!program) return;

    if (!fullName.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setSubmitError('Please enter your contact phone number.');
      return;
    }

    for (const question of questions) {
      if (question.required) {
        const val = (answers[question.id] || '').trim();
        if (!val) {
          setSubmitError(`Please answer: "${question.label}".`);
          return;
        }
      }
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await submitRegistration({
        projectId: program.id,
        volunteerName: fullName,
        volunteerEmail: email,
        phone,
        answers,
      });
      setIsSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Registration could not be completed. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  function parseSelectOptions(optionsStr?: string): string[] {
    if (!optionsStr) return [];
    return optionsStr
      .split(/[\r\n,]+/)
      .map((opt) => opt.trim())
      .filter(Boolean);
  }

  const formattedEventDate = formatEventDate(program.eventDate);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto overscroll-contain bg-ink/60 sm:items-center sm:p-6"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-title"
        tabIndex={-1}
        className="flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-panel border border-beige-dark bg-cream pb-[env(safe-area-inset-bottom)] text-ink shadow-dialog sm:max-h-[calc(100dvh-3rem)] sm:rounded-panel sm:pb-0"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-beige-dark bg-beige px-5 py-4 sm:px-6 sm:py-5">
          <div>
            <h2 id="registration-title" className="text-xl font-bold text-burgundy-dark">
              Register for {program.title}
            </h2>
            <div className="mt-1 text-sm text-muted space-y-0.5">
              {formattedEventDate && (
                <p>
                  <span className="font-medium text-ink">Date:</span> {formattedEventDate}
                </p>
              )}
              {program.venueName && (
                <p>
                  <span className="font-medium text-ink">Venue:</span> {program.venueName}
                  {program.venueAddress ? `, ${program.venueAddress}` : ''}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close registration dialog"
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg text-burgundy hover:bg-burgundy-light focus-visible:outline-burgundy"
          >
            <span aria-hidden="true" className="text-xl leading-none">&times;</span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto overscroll-contain p-5 scroll-pb-24 sm:p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4" role="status">
              <div className="mx-auto w-12 h-12 rounded-full bg-brand-green-light text-brand-green flex items-center justify-center font-bold text-xl" aria-hidden="true">
                &#10003;
              </div>
              <h3 className="text-xl font-bold text-burgundy-dark">Registration Confirmed</h3>
              <p className="text-muted max-w-md mx-auto">
                Thank you, <span className="font-semibold text-ink">{fullName}</span>. Your registration for <span className="font-semibold text-ink">{program.title}</span> has been received.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center items-center px-6 py-3 min-h-[44px] rounded-lg bg-burgundy text-white font-medium hover:bg-burgundy-dark focus-visible:outline-burgundy focus-visible:ring-offset-2"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && (
                <div
                  role="alert"
                  className="rounded-lg border border-burgundy/30 bg-burgundy-light p-4 text-sm text-burgundy-dark"
                >
                  {submitError}
                </div>
              )}

              {/* Standard contact fields */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
                  Your Contact Information
                </h3>

                <div>
                  <label htmlFor="reg-fullname" className="block text-sm font-medium text-ink mb-1">
                    Full Name <span className="text-red-600" aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={firstInputRef}
                    id="reg-fullname"
                    name="fullName"
                    autoComplete="name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg border border-muted text-burgundy-dark bg-white placeholder:text-muted focus-visible:outline-burgundy focus-visible:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-ink mb-1">
                    Email Address <span className="text-red-600" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="reg-email"
                    name="email"
                    autoComplete="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg border border-muted text-burgundy-dark bg-white placeholder:text-muted focus-visible:outline-burgundy focus-visible:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="reg-phone" className="block text-sm font-medium text-ink mb-1">
                    Phone Number <span className="text-red-600" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="reg-phone"
                    name="phone"
                    autoComplete="tel"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0123456789"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg border border-muted text-burgundy-dark bg-white placeholder:text-muted focus-visible:outline-burgundy focus-visible:border-transparent"
                  />
                </div>
              </div>

              {/* Dynamic program questions */}
              {loadingQuestions && (
                <div className="py-4 text-center text-sm text-muted" aria-live="polite">
                  Loading program specific questions...
                </div>
              )}

              {questionsError && (
                <div className="rounded-lg border border-burgundy/30 bg-beige p-3 text-sm text-burgundy-dark" role="alert">
                  {questionsError}
                </div>
              )}

              {questions.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-beige-dark">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
                    Program Requirements
                  </h3>

                  {questions.map((q) => {
                    const fieldId = `question-${q.id}`;
                    const options = parseSelectOptions(q.options);

                    return (
                      <div key={q.id}>
                        <label htmlFor={fieldId} className="block text-sm font-medium text-ink mb-1">
                          {q.label}{' '}
                          {q.required && (
                            <span className="text-red-600" aria-hidden="true">
                              *
                            </span>
                          )}
                        </label>

                        {q.type === 'select' ? (
                          <select
                            id={fieldId}
                            required={q.required}
                            value={answers[q.id] || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg border border-muted text-burgundy-dark bg-white focus-visible:outline-burgundy focus-visible:border-transparent"
                          >
                            <option value="">Select an option</option>
                            {options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : q.type === 'textarea' ? (
                          <textarea
                            id={fieldId}
                            rows={3}
                            required={q.required}
                            value={answers[q.id] || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            placeholder="Your answer"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-muted text-burgundy-dark bg-white placeholder:text-muted focus-visible:outline-burgundy focus-visible:border-transparent"
                          />
                        ) : q.type === 'number' ? (
                          <input
                            id={fieldId}
                            type="number"
                            required={q.required}
                            value={answers[q.id] || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            placeholder="0"
                            className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg border border-muted text-burgundy-dark bg-white placeholder:text-muted focus-visible:outline-burgundy focus-visible:border-transparent"
                          />
                        ) : q.type === 'date' ? (
                          <input
                            id={fieldId}
                            type="date"
                            required={q.required}
                            value={answers[q.id] || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg border border-muted text-burgundy-dark bg-white focus-visible:outline-burgundy focus-visible:border-transparent"
                          />
                        ) : q.type === 'checkbox' ? (
                          <div className="flex items-center gap-3 pt-1">
                            <input
                              id={fieldId}
                              type="checkbox"
                              checked={answers[q.id] === 'yes'}
                              onChange={(e) => handleAnswerChange(q.id, e.target.checked ? 'yes' : 'no')}
                              className="h-6 w-6 shrink-0 rounded border-muted text-burgundy focus-visible:ring-2 focus-visible:outline-burgundy"
                            />
                            <span className="text-sm text-ink">Yes, confirm</span>
                          </div>
                        ) : (
                          <input
                            id={fieldId}
                            type="text"
                            required={q.required}
                            value={answers[q.id] || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            placeholder="Your answer"
                            className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg border border-muted text-burgundy-dark bg-white placeholder:text-muted focus-visible:outline-burgundy focus-visible:border-transparent"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Actions */}
              <div className="sticky bottom-0 z-10 -mx-5 -mb-5 mt-6 flex flex-col-reverse gap-3 border-t border-beige-dark bg-cream px-5 py-4 sm:-mx-6 sm:-mb-6 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-5 py-2.5 min-h-[44px] rounded-lg border border-muted text-ink font-medium hover:bg-beige focus-visible:outline-burgundy focus-visible:ring-offset-2 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 min-h-[44px] rounded-lg bg-burgundy text-white font-medium hover:bg-burgundy-dark focus-visible:outline-burgundy focus-visible:ring-offset-2 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
