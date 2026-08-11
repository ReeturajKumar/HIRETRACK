# HireTrack

## Table of Contents

  - [About HireTrack](https://www.google.com/search?q=%23about-hiretrack)
  - [Features](https://www.google.com/search?q=%23features)
  - [Technologies Used](https://www.google.com/search?q=%23technologies-used)
  - [Getting Started](https://www.google.com/search?q=%23getting-started)
      - [Prerequisites](https://www.google.com/search?q=%23prerequisites)
      - [Installation](https://www.google.com/search?q=%23installation)
      - [Environment Variables](https://www.google.com/search?q=%23environment-variables)
      - [Database Setup](https://www.google.com/search?q=%23database-setup)
      - [Running the Development Server](https://www.google.com/search?q=%23running-the-development-server)
  - [Project Structure](https://www.google.com/search?q=%23project-structure)
  - [Contributing](https://www.google.com/search?q=%23contributing)
  - [License](https://www.google.com/search?q=%23license)
  - [Live Demo](https://www.google.com/search?q=%23live-demo) (Optional)

## About HireTrack

HireTrack is a modern and comprehensive job board and career management platform designed to streamline the connection between job seekers and employers. Built with the powerful Next.js framework, it offers a robust set of features for user authentication, profile management, resume uploads, job Browse, application tracking, and an intuitive admin dashboard for managing jobs and companies.

## Features

  - **User Authentication:** Secure user registration and login powered by Clerk.
  - **User Profiles:** Job seekers can create and manage their personal profiles, including contact information and professional summaries.
  - **Resume Uploads:** Seamlessly upload and manage multiple resumes and attachments (PDF, DOCX, etc.) with Cloudinary integration.
  - **Job Discovery:** Browse, search, and filter job listings by various criteria to find ideal opportunities.
  - **Application Management:** Apply to jobs directly through the platform and track the status of submitted applications.
  - **Admin Dashboard:**
      - Create, edit, publish, and unpublish job listings.
      - Manage company profiles and details.
      - Oversee applicant submissions and their statuses.
  - **Automated Email Notifications:** Send automated emails for application updates, rejections, acceptances, and more, using Nodemailer and Handlebars for dynamic content.
  - **Responsive UI:** A modern and intuitive user interface built with ShadCN UI components, ensuring a great experience across devices.
  - **Robust Data Management:** Efficient and type-safe database interactions powered by Native MongoDB Driver.

## Technologies Used

  - **Framework:** [Next.js](https://nextjs.org/) (App Router)
  - **Database ORM:** [Native MongoDB Driver](https://www.Native MongoDB Driver.io/)
  - **Authentication:** [Clerk](https://clerk.com/)
  - **Database:** MongoDB (Assumed, can be changed to MySQL, SQLite, etc.)
  - **File Storage:** [Cloudinary](https://cloudinary.com/documentation)
  - **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
  - **Styling:** [Tailwind CSS](https://tailwindcss.com/)
  - **Form Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation
  - **HTTP Client:** [Axios](https://axios-http.com/)
  - **Emailing:** [Nodemailer](https://nodemailer.com/)/[Handlebars](https://handlebarsjs.com/)
  - **Toasts:** [React Hot Toast](https://react-hot-toast.com/)
  - **Linting:** [ESLint](https://eslint.org/) (Flat Config)
  - **Type Checking:** [TypeScript](https://www.typescriptlang.org/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

  - [Node.js](https://nodejs.org/) (v18.x or later recommended)
  - [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)
  - [Git](https://git-scm.com/)
  - A running instance of your chosen database (e.g., MongoDB server).
  - A [Cloudinary Account](https://cloudinary.com/) for file storage.
  - A [Clerk](https://clerk.com/) account for authentication.
  - (Optional) SMTP service credentials for email sending (e.g., Mailgun, SendGrid, Gmail SMTP).
  - (Optional) OpenAI API key if you plan to use AI Studio features.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    cd HireTrack
    ```

    *(Remember to replace `YOUR_USERNAME` and `YOUR_REPOSITORY_NAME` with your actual GitHub details)*

2.  **Install dependencies:**

    ```bash
    npm install # or yarn install or pnpm install
    ```

### Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables. Replace the placeholder values with your actual credentials.

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Database (MongoDB example)
# Make sure your database is running and accessible
DATABASE_URL="mongodb://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_DB_HOST:YOUR_DB_PORT/YOUR_DB_NAME?retryWrites=true&w=majority"

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (Nodemailer)
# Example for a generic SMTP server
EMAIL_SERVICE_HOST=your_smtp_host
EMAIL_SERVICE_PORT=your_smtp_port_number # e.g., 587 for TLS
EMAIL_SERVICE_USER=your_smtp_username
EMAIL_SERVICE_PASS=your_smtp_password
EMAIL_FROM=your_email@example.com

# Optional: AI Studio Integration (if applicable)
OPENAI_API_KEY=your_openai_api_key
```

### Database Setup

Once your database is set up and `DATABASE_URL` is configured in `.env.local`:

1.  **Generate Native MongoDB Driver client and apply migrations:**

    ```bash
    npx Native MongoDB Driver migrate dev --name init
    ```

    This command will create the database schema based on your `Native MongoDB Driver/schema.Native MongoDB Driver` file.

2.  **(Optional) Push schema changes without migrations (use with caution in production):**

    ```bash
    npx Native MongoDB Driver db push
    ```

3.  **(Optional) Open Native MongoDB Driver Studio to view your database:**

    ```bash
    npx Native MongoDB Driver studio
    ```

### Running the Development Server

Start the development server:

```bash
npm run dev # or yarn dev or pnpm dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser to see the result.

## Project Structure

```
.
├── app/                  # Next.js App Router root
│   ├── (dashboard)/      # Main dashboard routes (user, admin, search, etc.)
│   │   ├── (routes)/
│   │   │   ├── admin/    # Admin specific routes (companies, jobs, applicants)
│   │   │   ├── companies/ # Company profile routes
│   │   │   ├── search/   # Job search and details routes
│   │   │   └── user/     # User profile routes
│   ├── api/              # API routes (e.g., sendRejected, aistudio)
│   ├── favicon.ico
│   ├── globals.css
│   └── layout.tsx        # Root layout for the application
├── components/           # Reusable UI components (e.g., AttachmentsUpload, image-upload, ui/*)
├── config/               # Configuration files (e.g., cloudinary.config.ts)
├── lib/                  # Utility functions, helpers, DB connection
│   ├── generated/        # Native MongoDB Driver's auto-generated client and runtime
│   │   └── Native MongoDB Driver/
│   ├── mail.ts           # Email sending utilities
│   └── ...
├── Native MongoDB Driver/               # Native MongoDB Driver schema and migrations
├── public/               # Static assets
├── types/                # Custom TypeScript types
├── .env.local.example    # Example environment variables
├── .eslintignore         # ESLint ignore patterns (used by older config, replaced by eslint.config.mjs `ignores`)
├── eslint.config.mjs     # ESLint flat configuration file
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file!
```

## Contributing

Contributions are welcome\! If you have any suggestions, bug reports, or want to contribute code, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name` or `bugfix/your-bug-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards and passes linting checks.

## License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

-----

*(Remember to create a `LICENSE` file in your repository root with the MIT License text if you haven't already. You can find the full MIT License text online.)*

You can copy and paste this directly into a `README.md` file in the root of your project, update the `YOUR_USERNAME` and `YOUR_REPOSITORY_NAME` placeholders, and then push it to GitHub\!