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

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
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
        className="w-full max-w-xl my-8 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-slate-900"
      >
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-5 flex items-start justify-between bg-slate-50">
          <div>
            <h2 id="registration-title" className="text-xl font-bold text-slate-900">
              Register for {program.title}
            </h2>
            <div className="mt-1 text-sm text-slate-600 space-y-0.5">
              {formattedEventDate && (
                <p>
                  <span className="font-medium text-slate-700">Date:</span> {formattedEventDate}
                </p>
              )}
              {program.venueName && (
                <p>
                  <span className="font-medium text-slate-700">Venue:</span> {program.venueName}
                  {program.venueAddress ? `, ${program.venueAddress}` : ''}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close registration dialog"
            className="rounded-lg p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <span aria-hidden="true" className="text-xl leading-none">&times;</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xl">
                &#10003;
              </div>
              <h3 className="text-xl font-bold text-slate-900">Registration Confirmed</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                Thank you, <span className="font-semibold text-slate-800">{fullName}</span>. Your registration for <span className="font-semibold text-slate-800">{program.title}</span> has been received.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center items-center px-6 py-3 min-h-[44px] rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
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
                  className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800"
                >
                  {submitError}
                </div>
              )}

              {/* Standard contact fields */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Your Contact Information
                </h3>

                <div>
                  <label htmlFor="reg-fullname" className="block text-sm font-medium text-slate-800 mb-1">
                    Full Name <span className="text-red-600" aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={firstInputRef}
                    id="reg-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-slate-800 mb-1">
                    Email Address <span className="text-red-600" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="reg-phone" className="block text-sm font-medium text-slate-800 mb-1">
                    Phone Number <span className="text-red-600" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0123456789"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent"
                  />
                </div>
              </div>

              {/* Dynamic program questions */}
              {loadingQuestions && (
                <div className="py-4 text-center text-sm text-slate-500" aria-live="polite">
                  Loading program specific questions...
                </div>
              )}

              {questionsError && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                  {questionsError}
                </div>
              )}

              {questions.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-slate-200">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Program Requirements
                  </h3>

                  {questions.map((q) => {
                    const fieldId = `question-${q.id}`;
                    const options = parseSelectOptions(q.options);

                    return (
                      <div key={q.id}>
                        <label htmlFor={fieldId} className="block text-sm font-medium text-slate-800 mb-1">
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
                            className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg border border-slate-300 text-slate-900 bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent"
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
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent"
                          />
                        ) : q.type === 'number' ? (
                          <input
                            id={fieldId}
                            type="number"
                            required={q.required}
                            value={answers[q.id] || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            placeholder="0"
                            className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent"
                          />
                        ) : q.type === 'date' ? (
                          <input
                            id={fieldId}
                            type="date"
                            required={q.required}
                            value={answers[q.id] || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg border border-slate-300 text-slate-900 bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent"
                          />
                        ) : q.type === 'checkbox' ? (
                          <div className="flex items-center gap-3 pt-1">
                            <input
                              id={fieldId}
                              type="checkbox"
                              checked={answers[q.id] === 'yes'}
                              onChange={(e) => handleAnswerChange(q.id, e.target.checked ? 'yes' : 'no')}
                              className="h-5 w-5 rounded border-slate-300 text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600"
                            />
                            <span className="text-sm text-slate-700">Yes, confirm</span>
                          </div>
                        ) : (
                          <input
                            id={fieldId}
                            type="text"
                            required={q.required}
                            value={answers[q.id] || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            placeholder="Your answer"
                            className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-5 py-2.5 min-h-[44px] rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 min-h-[44px] rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-60 flex items-center justify-center gap-2"
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
