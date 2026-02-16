// Generate a simple placeholder PDF for tech sheet download
// PDF 1.4 spec minimal valid file

const header = '%PDF-1.4\n';
const body = `1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj

2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj

3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj

4 0 obj
<< /Length 440 >>
stream
BT
/F1 28 Tf
50 720 Td
(CHINA Trading) Tj
/F1 18 Tf
0 -40 Td
(Product Technical Sheet) Tj
/F1 12 Tf
0 -50 Td
(Company: CHINA Trading International Export) Tj
0 -20 Td
(Website: www.chinatrading.com) Tj
0 -20 Td
(Email: info@chinatrading.com) Tj
0 -20 Td
(Phone: +86 123 456 7890) Tj
0 -40 Td
(This is a general technical data sheet for our products.) Tj
0 -20 Td
(For specific product specifications, please contact our team.) Tj
0 -40 Td
(Quality Certifications: ISO 22000, HACCP, BRC, IFS) Tj
0 -20 Td
(All products comply with international food safety standards.) Tj
ET
endstream
endobj

5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj

`;

const xrefOffset = header.length + body.length;
const xref = `xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000758 00000 n 

`;

const trailer = `trailer
<< /Size 6 /Root 1 0 R >>
startxref
${xrefOffset}
%%EOF`;

const pdf = header + body + xref + trailer;

import { writeFileSync } from 'fs';
writeFileSync('public/techsheet.pdf', pdf);
console.log('PDF generated at public/techsheet.pdf');
