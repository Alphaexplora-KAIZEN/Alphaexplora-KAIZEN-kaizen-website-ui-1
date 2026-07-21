import { useEffect, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MaterialIcon from './MaterialIcon';
import { useScrollLock } from '../hooks/useScrollLock';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

const SERVICE_OPTIONS = [
  'Property Management',
  'Cleaning Services',
  'Aircon Care',
  'Inquiry',
];

const inputClasses =
  'w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue transition-colors';

export default function BookingModal({ open, onClose }: BookingModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(SERVICE_OPTIONS[0]);
  const [message, setMessage] = useState('');

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setService(SERVICE_OPTIONS[0]);
      setMessage('');
    }
  }, [open]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-navy-deep/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-3xl bg-surface-container-lowest shadow-ambient-hover"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close booking form"
              className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors focus-ring"
            >
              <MaterialIcon name="close" />
            </button>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center text-center px-8 py-14"
              >
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-soft text-teal"
                >
                  <MaterialIcon name="check_circle" filled className="text-4xl" />
                </motion.div>
                <h3 className="mt-5 font-headline-sm text-headline-sm text-on-surface">Request received</h3>
                <p className="mt-2 font-body-md text-body-md text-on-surface-variant max-w-xs">
                  Thanks{firstName ? `, ${firstName}` : ''}! Our team will reach out shortly to confirm your{' '}
                  {service.toLowerCase()} booking.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 inline-flex bg-primary-container text-on-primary font-label-bold text-label-bold px-6 py-3 rounded-full hover:bg-navy-deep hover:text-teal transition-all duration-200 focus-ring"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 pt-8 pb-6 md:px-8 md:pt-10 md:pb-8">
                <h3 id="booking-modal-title" className="font-headline-sm text-headline-sm text-on-surface pr-8">
                  Book a Service
                </h3>
                <p className="mt-1.5 font-body-md text-body-md text-on-surface-variant">
                  Tell us a bit about what you need and we'll get back to you shortly.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="booking-first-name" className="mb-1.5 block font-label-bold text-label-bold text-on-surface uppercase tracking-wider">
                        First Name
                      </label>
                      <input
                        id="booking-first-name"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Juan"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-last-name" className="mb-1.5 block font-label-bold text-label-bold text-on-surface uppercase tracking-wider">
                        Last Name
                      </label>
                      <input
                        id="booking-last-name"
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Dela Cruz"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="booking-email" className="mb-1.5 block font-label-bold text-label-bold text-on-surface uppercase tracking-wider">
                        Email
                      </label>
                      <input
                        id="booking-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-phone" className="mb-1.5 block font-label-bold text-label-bold text-on-surface uppercase tracking-wider">
                        Phone
                      </label>
                      <input
                        id="booking-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="09XX XXX XXXX"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="booking-service" className="mb-1.5 block font-label-bold text-label-bold text-on-surface uppercase tracking-wider">
                      Service Needed
                    </label>
                    <select
                      id="booking-service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className={`${inputClasses} appearance-none bg-no-repeat bg-[right_1rem_center]`}
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2343474e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                      }}
                    >
                      {SERVICE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="booking-message" className="mb-1.5 block font-label-bold text-label-bold text-on-surface uppercase tracking-wider">
                      Details <span className="normal-case font-body-md text-on-surface-variant/70">(optional)</span>
                    </label>
                    <textarea
                      id="booking-message"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Property size, preferred schedule, or anything else we should know"
                      className={`${inputClasses} resize-none`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full inline-flex items-center justify-center bg-primary-container text-on-primary font-label-bold text-label-bold px-6 py-3.5 rounded-full hover:bg-navy-deep hover:text-teal transition-all duration-200 shadow-glow hover:shadow-glow-hover active:scale-95 focus-ring"
                >
                  Submit Request
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
