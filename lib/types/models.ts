/**
 * TypeScript type definitions for data models
 * 
 * These interfaces define the structure of data models used throughout the application.
 * They represent the application-level view with string IDs (not MongoDB ObjectIds).
 */

/**
 * User model
 * Represents a user in the system
 */
export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  createdAt: Date;
  role: 'user' | 'admin';
}

/**
 * Job model
 * Represents a job posting
 */
export interface Job {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  short_description: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  tags: string[];
  savedUsers: string[];
  employmentType: string | null;
  salaryRange: string | null;
  yearsOfExperience: string | null;
  workMode: string | null;
  categoryId: string | null;
  companyId: string | null;
  attachments: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Company model
 * Represents a company profile
 */
export interface Company {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  logo: string | null;
  coverImage: string | null;
  mail: string | null;
  website: string | null;
  likedIn: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
  followers: string[];
  overview: string | null;
  whyJoinUs: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Category model
 * Represents a job category
 */
export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * AppliedJob model
 * Represents a job application within a user profile
 */
export interface AppliedJob {
  jobId: string;
  appliedAt: Date;
}

/**
 * UserProfile model
 * Represents a user's profile information
 */
export interface UserProfile {
  userId: string;
  fullName: string | null;
  email: string | null;
  contact: string | null;
  appliedJobs: AppliedJob[];
  activeResumeId: string | null;
  resumes: Resumes[];
}

/**
 * Resumes model
 * Represents a resume document
 */
export interface Resumes {
  id: string;
  name: string;
  url: string;
  userProfileId: string;
  createdAt: Date;
  updatedAt: Date;
}
/**
 * AttachmentItem model
 * Represents a file attachment linked to a job
 */
export interface AttachmentItem {
  id?: string;
  name: string;
  url: string;
}
