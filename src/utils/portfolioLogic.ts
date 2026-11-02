export interface ContactSubmissionInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactValidationResult {
  isValid: boolean;
  errors: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  values: ContactSubmissionInput;
}

export interface ProjectSummary {
  id: string;
  category: 'web-mobile' | 'systems' | 'community';
  title: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContactSubmission(input: ContactSubmissionInput): ContactValidationResult {
  const name = input.name.trim();
  const email = input.email.trim();
  const subject = input.subject.trim();
  const message = input.message.trim();

  const errors = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  if (name.length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  }

  if (!email) {
    errors.email = 'Please enter your email address.';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (subject.length < 3) {
    errors.subject = 'Please include a clear subject line.';
  }

  if (message.length < 10) {
    errors.message = 'Please enter a message of at least 10 characters.';
  }

  const isValid =
    errors.name === '' &&
    errors.email === '' &&
    errors.subject === '' &&
    errors.message === '';

  return {
    isValid,
    errors,
    values: { name, email, subject, message },
  };
}

export function filterProjectsByCategory(
  projects: readonly ProjectSummary[],
  selectedCategory: string
): ProjectSummary[] {
  if (selectedCategory === 'all') {
    return [...projects];
  }
  return projects.filter((project) => project.category === selectedCategory);
}

export function formatProjectCountStatus(visibleCount: number, selectedCategory: string): string {
  const filterLabels: Record<string, string> = {
    all: 'featured projects',
    'web-mobile': 'Web & Mobile project',
    systems: 'Systems & ADB projects',
    community: 'Community & Media project',
  };

  if (selectedCategory === 'all') {
    return `Showing all ${visibleCount} featured projects`;
  }
  const descriptor = filterLabels[selectedCategory] ?? 'projects';
  return `Showing ${visibleCount} ${descriptor}`;
}
