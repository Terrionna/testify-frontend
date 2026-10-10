export interface Question {
  text: string;
  choices: string[];
}
export interface TestSummary {
  _id: string;
  title: string;
  version: number;
  passingScore: number;
}
export interface TestDetail extends TestSummary {
  questions: Question[];
}
export interface AttemptResult {
  score: number;
  passed: boolean;
  correct: number;
  total: number;
  certificateCode: string | null;
}
export interface Attempt {
  _id: string;
  test: { _id: string; title: string };
  score: number;
  passed: boolean;
  takenAt: string;
}
export interface Certificate {
  _id: string;
  test: { _id: string; title: string };
  code: string;
  issuedAt: string;
}
export interface CertificateVerification {
  name: string;
  title: string;
  version: number;
  issuedAt: string;
}
export interface AdminTest {
  _id: string;
  title: string;
  version: number;
  passingScore: number;
  published: boolean;
  questions: { text: string; choices: string[]; answer: number }[];
}
