import os
import glob
import re
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, HRFlowable, Preformatted, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from PIL import Image as PILImage

def convert_md_to_pdf(md_path, pdf_path):
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=45, leftMargin=45, topMargin=45, bottomMargin=45
    )
    styles = getSampleStyleSheet()
    
    # Elegant Formal Serif Typography with keepWithNext=True to prevent orphan headings
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Times-Bold',
        fontSize=19,
        leading=23,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=10,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'DocH2',
        parent=styles['Heading2'],
        fontName='Times-Bold',
        fontSize=13.5,
        leading=17,
        textColor=colors.HexColor('#1E3A8A'),
        spaceBefore=12,
        spaceAfter=5,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'DocH3',
        parent=styles['Heading3'],
        fontName='Times-Bold',
        fontSize=11.5,
        leading=14.5,
        textColor=colors.HexColor('#334155'),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=5
    )

    code_style = ParagraphStyle(
        'DocCode',
        parent=styles['Code'],
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor('#0F172A'),
        backColor=colors.HexColor('#F8FAFC'),
        borderPadding=5,
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
        
        # Explicit Master report page break separator
        if '=========================================================================' in raw:
            story.append(PageBreak())
            continue

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
            story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceBefore=6, spaceAfter=6))
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

        # Images: Proportional sizing with max height constraint to fit cleanly on pages
        if raw.strip().startswith('!['):
            m = re.match(r'!\[.*?\]\((.*?)\)', raw.strip())
            if m:
                img_p = m.group(1)
                if os.path.exists(img_p):
                    try:
                        with PILImage.open(img_p) as im:
                            orig_w, orig_h = im.size
                        
                        target_w = 470  # Printable width
                        aspect_ratio = orig_h / orig_w
                        target_h = target_w * aspect_ratio
                        
                        # Cap max height so images stay on same page as section heading
                        if target_h > 230:
                            target_h = 230
                            target_w = target_h / aspect_ratio
                        
                        story.append(Spacer(1, 3))
                        story.append(RLImage(img_p, width=target_w, height=target_h))
                        story.append(Spacer(1, 4))
                    except Exception as img_err:
                        print(f"Error processing image: {img_err}")
            continue

        if raw.strip():
            clean_text = raw.replace('**', '<b>').replace('**', '</b>')
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
            final_text = final_text.replace('& ', '&amp; ')
            story.append(Paragraph(final_text, body_style))

    doc.build(story)
    print(f"Generated PDF with clean page breaks & keepWithNext: {pdf_path}")

if __name__ == '__main__':
    docs_dir = '/Users/justin/Public/projects/CRT/docs'
    md_files = glob.glob(os.path.join(docs_dir, '*.md'))
    for md_f in md_files:
        pdf_f = md_f[:-3] + '.pdf'
        try:
            convert_md_to_pdf(md_f, pdf_f)
        except Exception as e:
            print(f"Error converting {md_f}: {e}")
