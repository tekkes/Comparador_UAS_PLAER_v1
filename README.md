# COMPARADOR UAS - PLAER

This is a Next.js application for comparing military UAS data.

## ⚠️ IMPORTANT: Installation Note ⚠️

**This project is located on a Google Drive (File Stream) location (`W:\...`).**
Node.js and package managers (`npm`, `pnpm`, `yarn`) **DO NOT work reliably** on network/virtual drives due to file system limitations (symlinks, locking).

### How to Run This Project

1.  **Move the folder** `uas-comparator` to a **local drive** (e.g., `C:\Users\YourUser\Desktop\uas-comparator`).
2.  Open a terminal in the new local location.
3.  Run the following commands:

```bash
# Clean previous failed installs
rm -rf node_modules package-lock.json

# Install dependencies
npm install
npm install lucide-react recharts papaparse jspdf jspdf-autotable clsx tailwind-merge @types/papaparse

# Run the development server
npm run dev
```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

-   **Data Source**: Google Sheets (via published CSV).
-   **Comparison**: Select up to 5 UAS to compare side-by-side.
-   **PDF Export**: Generate professional reports.
-   **Dark Mode**: Default aesthetic matching the Stitch design.
