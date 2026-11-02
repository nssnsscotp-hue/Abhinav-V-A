import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateContactSubmission,
  filterProjectsByCategory,
  formatProjectCountStatus,
  type ProjectSummary,
} from './portfolioLogic';

const SAMPLE_PROJECTS: ProjectSummary[] = [
  { id: 'campuspulse', category: 'web-mobile', title: 'CampusPulse Hybrid Hub' },
  { id: 'droidtune', category: 'systems', title: 'DroidTune ADB Diagnostics Suite' },
  { id: 'hackflow', category: 'community', title: 'HackFlow Media & Logistics Desk' },
  { id: 'labrig', category: 'systems', title: 'LabRig Peripheral Provisioner' },
];

test('validateContactSubmission rejects empty and malformed inputs without silent fallbacks', () => {
  const emptyResult = validateContactSubmission({
    name: ' ',
    email: 'invalid-email',
    subject: 'Hi',
    message: 'Short',
  });

  assert.equal(emptyResult.isValid, false);
  assert.notEqual(emptyResult.errors.name, '');
  assert.equal(emptyResult.errors.email, 'Please enter a valid email address.');
  assert.notEqual(emptyResult.errors.subject, '');
  assert.notEqual(emptyResult.errors.message, '');
});

test('validateContactSubmission accepts valid trimmed submission fields', () => {
  const validResult = validateContactSubmission({
    name: '  Jordan Patel ',
    email: ' jordan@university.edu ',
    subject: '  Campus Hackathon Workshop ',
    message: '  Would love to collaborate on an Android & Capacitor build workshop this semester. ',
  });

  assert.equal(validResult.isValid, true);
  assert.equal(validResult.values.name, 'Jordan Patel');
  assert.equal(validResult.values.email, 'jordan@university.edu');
  assert.equal(validResult.errors.email, '');
});

test('filterProjectsByCategory filters accurately across categories', () => {
  assert.equal(filterProjectsByCategory(SAMPLE_PROJECTS, 'all').length, 4);
  assert.equal(filterProjectsByCategory(SAMPLE_PROJECTS, 'systems').length, 2);
  assert.equal(filterProjectsByCategory(SAMPLE_PROJECTS, 'web-mobile').length, 1);
  assert.equal(filterProjectsByCategory(SAMPLE_PROJECTS, 'community').length, 1);
});

test('formatProjectCountStatus generates accurate status labels', () => {
  assert.equal(formatProjectCountStatus(4, 'all'), 'Showing all 4 featured projects');
  assert.equal(formatProjectCountStatus(2, 'systems'), 'Showing 2 Systems & ADB projects');
});
