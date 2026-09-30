import os
import glob
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, HRFlowable, Preformatted
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def convert_md_to_pdf(md_path, pdf_path):
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#1A365D'),
        spaceAfter=12
    )
    
    h2_style = ParagraphStyle(
        'DocH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#2B6CB0'),
        spaceBefore=10,
        spaceAfter=6
    )

    h3_style = ParagraphStyle(
        'DocH3',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#2D3748'),
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#2D3748'),
        spaceAfter=6
    )

    code_style = ParagraphStyle(
        'DocCode',
        parent=styles['Code'],
        fontName='Courier',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#1A202C'),
        backColor=colors.HexColor('#EDF2F7'),
        borderPadding=6,
        spaceBefore=4,
        spaceAfter=6
    )

    story = []
    
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    in_code = False
    code_lines = []

    for line in lines:
        raw = line.rstrip('\n')
        
        if raw.startswith('```'):
            if in_code:
                code_text = '\n'.join(code_lines)
                story.append(Preformatted(code_text, code_style))
                code_lines = []
                in_code = False
            else:
                in_code = True
                code_lines = []
            continue

        if in_code:
            code_lines.append(raw)
            continue

        if raw.strip() == '---':
            story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E0'), spaceBefore=8, spaceAfter=8))
            continue

        if raw.startswith('# '):
            story.append(Paragraph(raw[2:], title_style))
            continue
        elif raw.startswith('## '):
            story.append(Paragraph(raw[3:], h2_style))
            continue
        elif raw.startswith('### '):
            story.append(Paragraph(raw[4:], h3_style))
            continue

        if raw.strip().startswith('!['):
            import re
            m = re.match(r'!\[.*?\]\((.*?)\)', raw.strip())
            if m:
                img_p = m.group(1)
                if os.path.exists(img_p):
                    story.append(Spacer(1, 4))
                    story.append(Image(img_p, width=500, height=280))
                    story.append(Spacer(1, 6))
            continue

        if raw.strip():
            # Clean markdown bold/italic formatting for ReportLab
            clean_text = raw.replace('**', '<b>').replace('**', '</b>')
            # Handle remaining bold replacements
            parts = clean_text.split('<b>')
            formatted_parts = []
            for i, p in enumerate(parts):
                if i == 0:
                    formatted_parts.append(p)
                else:
                    subparts = p.split('</b>', 1)
                    if len(subparts) == 2:
                        formatted_parts.append(f'<b>{subparts[0]}</b>{subparts[1]}')
                    else:
                        formatted_parts.append(p)
            final_text = ''.join(formatted_parts)
            # Escape & if needed except in tags
            final_text = final_text.replace('& ', '&amp; ')
            story.append(Paragraph(final_text, body_style))

    doc.build(story)
    print(f"Generated PDF: {pdf_path}")

if __name__ == '__main__':
    docs_dir = '/Users/justin/Public/projects/CRT/docs'
    md_files = glob.glob(os.path.join(docs_dir, '*.md'))
    for md_f in md_files:
        pdf_f = md_f[:-3] + '.pdf'
        try:
            convert_md_to_pdf(md_f, pdf_f)
        except Exception as e:
            print(f"Error converting {md_f}: {e}")
