========================================================================
    CLOUD TECH — DIGITAL ELECTRICAL PASSPORT SYSTEM DOCUMENTATION
========================================================================

This system is built as a clean, static, mobile-first solution. It uses 
HTML and CSS encapsulated within a single index.html file per project. 
This makes duplication, file management, and updates extremely easy 
via cPanel File Manager or any standard FTP client (e.g., FileZilla).

------------------------------------------------------------------------
1. WHERE TO UPLOAD THE FILES ON HOSTING
------------------------------------------------------------------------
To make the links work on your website, you need to upload the entire 
"projects" folder to your web server's root directory:

* Target Folder on Hosting: /public_html/
* Uploaded Path Structure:
  /public_html/projects/
  ├── README.txt
  └── STR-001/
      ├── index.html
      └── electrical-passport.pdf

* Verify Live Access:
  Once uploaded, open a web browser and check the URL:
  https://www.cloudtech.mk/projects/STR-001/

------------------------------------------------------------------------
2. WHAT LINK TO USE FOR THE QR CODE
------------------------------------------------------------------------
When printing a QR code sticker to place inside a fuse box or cabinet:

* Target QR Code URL:
  https://www.cloudtech.mk/projects/STR-001/
  
  (Always include the trailing slash "/" to let the web server serve 
  the index.html directly without redirection).

* Tip for Generating QR Codes:
  Use a high-quality free QR generator (e.g., qr-code-generator.com) 
  and generate it as a static "URL" QR code. Since the URL is short, 
  the QR code will print cleanly even on small 2cm x 2cm stickers.

------------------------------------------------------------------------
3. HOW TO DUPLICATE THE PROJECT FOLDER FOR A NEW HOUSE
------------------------------------------------------------------------
To add a new project (for example, "OHR-002" in Ohrid):

1. Copy the entire "STR-001" folder.
2. Rename the copied folder to "OHR-002".
3. Inside the "OHR-002" folder, open "index.html" with any text editor.
4. Locate the following project details and update them:
   - Page Title: <title>OHR-002 | Digital Electrical Passport</title>
   - Badge ID: <span class="project-id-badge">OHR-002</span>
   - Location: <span class="metadata-value">Ohrid</span>
   - System Type: <span class="metadata-value">Electrical &amp; Smart Home</span> (or modify as needed)
   - Last Updated: <span class="metadata-value">16 June 2026</span> (update to date of changes)
5. Save the file.
6. Upload the new "OHR-002" folder to your "/public_html/projects/" directory.
7. The new passport will immediately go live at:
   https://www.cloudtech.mk/projects/OHR-002/

------------------------------------------------------------------------
4. HOW TO REPLACE THE PDF
------------------------------------------------------------------------
By default, the 3 PDF buttons point to "electrical-passport.pdf" located 
locally in the same project folder.

To upload the real documentation:
1. Merge or split your documentation files.
2. If you want a single file for all three buttons, rename your final PDF 
   to "electrical-passport.pdf" and overwrite the placeholder in the folder.
3. If you want separate PDFs for each button (e.g., electrical drawings, 
   fuse details, smart layout):
   - Name them uniquely (e.g., drawings.pdf, fuse-box.pdf, smart-home.pdf).
   - Place them inside the folder.
   - Edit "index.html" and update the "href" value of each button to point 
     to the correct filename:
     - For Electrical: href="drawings.pdf"
     - For Fuse Box: href="fuse-box.pdf"
     - For Smart Home: href="smart-home.pdf"

------------------------------------------------------------------------
5. WHY THE QR SHOULD POINT TO THE PROJECT PAGE (NOT DIRECTLY TO THE PDF)
------------------------------------------------------------------------
It is critical to point the QR code sticker to the project HTML page 
rather than linking directly to the PDF file for these key reasons:

* File Swaps Without Re-printing Stickers:
  If a customer updates their home installation next year, you can 
  just upload a new PDF file to the folder. Since the QR code points to the 
  index.html page, you DO NOT need to reprint and physically replace the 
  QR sticker inside the house's electrical cabinet.

* Mobile Browser Compatibility:
  Linking directly to a PDF on mobile devices has inconsistent behavior:
  - iOS devices will open the PDF in the browser.
  - Many Android devices will download the PDF silently in the background 
    without showing it, leaving technicians confused about if it scanned.
  An HTML page opens instantly on all phones and lets the user choose 
  to view the PDF, call your office, or verify credentials.

* Multi-Document Support & Brand Presence:
  A single cabinet often has separate files (wiring, fuse labels, code). 
  An HTML page acts as a clean portal showing all files in one place, 
  while reinforcing Cloud Tech's premium branding.

* Easy Contact CTA:
  If a technician finds a short circuit, they can tap the "Call Cloud Tech" 
  button immediately without needing to search for your contact info.
========================================================================
