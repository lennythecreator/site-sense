# Site-Sense Studio — Alpha Testers Guide

Welcome to the **Alpha** version of Site-Sense Studio! This guide will help you understand how to install, run, and use Site-Sense Studio to scan websites for accessibility issues. Since this application is still in alpha, please note that some features may be limited or unstable. We appreciate your feedback in improving the product.

---

## Table of Contents

1. [Overview](#overview)  
2. [Installation](#installation)  
3. [Launching the Application](#launching-the-application)  
4. [User Interface Overview](#user-interface-overview)  
5. [Performing a Scan](#performing-a-scan)  
6. [Working with Results](#working-with-results)  
7. [Navigating Within Site-Sense Studio](#navigating-within-site-sense-studio)  
8. [Sharing Your Report](#sharing-your-report)  
9. [Troubleshooting & Feedback](#troubleshooting--feedback)

---

## Overview

Site-Sense Studio is an accessibility testing tool that helps you:

- **Load a webpage** directly within the application.  
- **Automatically scan** the webpage for common accessibility violations.  
- **Highlight violations** in the live preview, color-coded by severity.  
- **View detailed reports** on each identified issue, including recommended solutions.  
- **Filter** violations by severity level to quickly focus on critical problems.  

---

## Installation

1. **Obtain the Installer**  
   - You will receive a standalone installer (e.g., a `.exe`, `.dmg`, or `.AppImage`) from the development team or alpha release page.

2. **Run the Installer**  
   - Follow the on-screen instructions to install Site-Sense Studio to your system.  
   - Once installed, you should see a **Site-Sense Studio** icon on your desktop or in your applications directory.

---

## Launching the Application

1. **Open Site-Sense Studio**  
   - Double-click the application icon from your desktop or applications folder.  
2. **Allow Any Prompts**  
   - On first launch, you may be prompted to confirm the software’s publisher or to allow network access. Click **Allow** or **Yes** if prompted.

---

## User Interface Overview

When Site-Sense Studio opens, you’ll see:

1. **Header Section**  
   - **URL Field**: A text box where you can type or paste the address of the website you want to test (e.g., `https://example.com`).  
   - **Generate Report Button**: Launches the scan for the entered URL.  
   - **Share Report Button**: Placeholder button in alpha; in future versions, this will allow you to export or share findings.

2. **Status & Summaries**  
   - **Loading Progress Bar**: When a scan runs, a progress bar appears to indicate scanning progress.  
   - **Violation Summary**: Displays a quick count of how many violations are labeled `critical`, `serious`, `moderate`, or `minor`.

3. **Main Window**  
   - **Webview Panel**: Displays the website you’re currently scanning. You can click links and navigate around as if you were using a browser.  
   - **Report Data Panel**: Shows the list of identified accessibility violations after a scan. This panel is scrollable and grouped by violation severity or category.

---

## Performing a Scan

1. **Enter the Website URL**  
   - In the input box at the top, type or paste the URL of the site you want to test.  

2. **Click “Generate Report”**  
   - The app will start analyzing the page.  
   - If it’s your first scan for this site, you’ll see the progress bar move.  
   - When the scan completes, you’ll see the **Report Data** panel below the webview update with details.

3. **Auto-Scan on Navigation** (Alpha Feature)  
   - If you click any links **within** the webview panel, the app will automatically re-scan the newly loaded page.  
   - You’ll see the progress bar each time a new page is loaded and scanned.

---

## Working with Results

1. **Violation Summary**  
   - At the top (near the header), you’ll see counters for critical, serious, moderate, and minor issues. This gives you a quick snapshot of the overall accessibility status.

2. **Report Data Panel**  
   - Below the main webview, each violation appears in a card format.  
   - **Impact Badge**: Shows the severity (critical, serious, moderate, or minor).  
   - **Description**: Explains what the issue is.  
   - **Resolution**: A link to further reading or guidelines on how to fix the issue.

3. **Filtering by Impact**  
   - In the “Report Data” section, there is a dropdown labeled **“Filter by impact.”**  
   - Select an impact level (all, minor, moderate, serious, or critical) to view only those violations.

4. **Detailed Violation View**  
   - Under each violation’s card, there’s a “View Violation Details” section you can expand.  
   - It shows you:
     - **HTML snippet** of the violating element.  
     - **Target**: The specific CSS selectors that the scan tool flagged.  
     - **Failure Summary**: A short description of why the element fails accessibility guidelines.

---

## Navigating Within Site-Sense Studio

- **Webview Navigation**  
  - You can **click links** inside the webview to move around the site. Each time you navigate, the app automatically scans the new page.  
- **Manual URL Entry**  
  - If you wish to test a completely different site, just type a new URL into the text box and click **Generate Report**.

---

## Sharing Your Report

- Currently, the **“Share report”** button is a placeholder in this alpha release.  
- In the future, you’ll be able to export your violation data, share it as a PDF, or collaborate with others through a direct link.  
- If you have any suggestions on the best ways to share or export reports, please let us know!

---

## Troubleshooting & Feedback

1. **No Violations Found**  
   - It’s possible the site genuinely has no detectable issues, or that our scanner may have missed some. Please let us know if you spot issues that the tool did not detect.  
2. **Scanning Errors or Timeouts**  
   - Check your internet connection and try again. If the problem persists with a valid URL, note the URL and let our team know.  
3. **Webview Issues**  
   - If the embedded webview does not load or appears blank, try reopening the application.  
   - Confirm you have stable internet access.  
4. **Crashes or Unexpected Behavior**  
   - Report any crashes with as much detail as possible (e.g., what you clicked, what the error message said).

---

### Thank You

Thank you for being an alpha tester of Site-Sense Studio! Your feedback is critical to shaping a more robust, user-friendly accessibility scanning tool. If you have any questions or need help, please reach out to the development team.

**Happy testing!**
