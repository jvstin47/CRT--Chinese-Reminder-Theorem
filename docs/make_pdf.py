import os
import glob
import re
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, HRFlowable, Preformatted, PageBreak, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from PIL import Image as PILImage, ImageEnhance

def format_inline_text(text):
    clean_text = text.replace('**', '<b>').replace('**', '</b>')
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
    return final_text.replace('& ', '&amp; ')

def get_bw_image_path(img_p):
    """Converts image to high-contrast grayscale optimized for B&W printing/viewing."""
    bw_dir = os.path.join(os.path.dirname(img_p), 'bw_cache')
    os.makedirs(bw_dir, exist_ok=True)
    base_name = os.path.basename(img_p)
    bw_path = os.path.join(bw_dir, 'bw_' + base_name)
    
    try:
        with PILImage.open(img_p) as im:
            bw_im = im.convert('L')
            enhancer = ImageEnhance.Contrast(bw_im)
            bw_im = enhancer.enhance(1.25)
            sharpener = ImageEnhance.Sharpness(bw_im)
            bw_im = sharpener.enhance(1.2)
            bw_im.save(bw_path)
            return bw_path, im.size
    except Exception as e:
        print(f"Error converting image to B&W: {e}")
        return img_p, (470, 200)

def convert_md_to_pdf(md_path, pdf_path):
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36
    )
    styles = getSampleStyleSheet()
    
    # High-Contrast Monochrome Academic Typography (+3pt font size boost over initial 9.5pt -> 11.5pt body, 20pt title)
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Times-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#000000'),
        spaceAfter=6,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'DocH2',
        parent=styles['Heading2'],
        fontName='Times-Bold',
        fontSize=14.5,
        leading=18,
        textColor=colors.HexColor('#111111'),
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'DocH3',
        parent=styles['Heading3'],
        fontName='Times-Bold',
        fontSize=12.5,
        leading=15.5,
        textColor=colors.HexColor('#222222'),
        spaceBefore=6,
        spaceAfter=2,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=11.5,
        leading=15,
        textColor=colors.HexColor('#000000'),
        spaceAfter=3
    )

    table_cell_style = ParagraphStyle(
        'DocTableCell',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#000000'),
        spaceAfter=0
    )

    code_style = ParagraphStyle(
        'DocCode',
        parent=styles['Code'],
        fontName='Courier',
        fontSize=8.5,
        leading=10.5,
        textColor=colors.HexColor('#000000'),
        backColor=colors.HexColor('#F2F2F2'),
        borderPadding=4,
        spaceBefore=3,
        spaceAfter=4
    )

    story = []
    
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    in_code = False
    code_lines = []
    table_lines = []

    def flush_table():
        if not table_lines:
            return
        table_data = []
        for tline in table_lines:
            if '---' in tline or tline == '| | |' or tline == '| |':
                continue
            cols = [c.strip() for c in tline.strip('|').split('|')]
            if len(cols) == 2:
                p1 = Paragraph(format_inline_text(cols[0]), table_cell_style)
                p2 = Paragraph(format_inline_text(cols[1]), table_cell_style)
                table_data.append([p1, p2])
        if table_data:
            t = Table(table_data, colWidths=[270, 270])
            t.setStyle(TableStyle([
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F5F5F5')),
                ('BOX', (0,0), (-1,-1), 1.0, colors.HexColor('#222222')),
                ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CCCCCC')),
                ('TOPPADDING', (0,0), (-1,-1), 4),
                ('BOTTOMPADDING', (0,0), (-1,-1), 4),
                ('LEFTPADDING', (0,0), (-1,-1), 6),
                ('RIGHTPADDING', (0,0), (-1,-1), 6),
            ]))
            story.append(t)
            story.append(Spacer(1, 4))
        table_lines.clear()

    for line in lines:
        raw = line.rstrip('\n')

        if raw.strip().startswith('|'):
            table_lines.append(raw.strip())
            continue
        elif table_lines:
            flush_table()
        
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
            story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#333333'), spaceBefore=4, spaceAfter=4))
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

        # Images: B&W grayscale conversion & proportional sizing
        if raw.strip().startswith('!['):
            m = re.match(r'!\[.*?\]\((.*?)\)', raw.strip())
            if m:
                img_p = m.group(1)
                if os.path.exists(img_p):
                    try:
                        bw_img_p, (orig_w, orig_h) = get_bw_image_path(img_p)
                        
                        target_w = 540  # Printable width
                        aspect_ratio = orig_h / orig_w
                        target_h = target_w * aspect_ratio
                        
                        # Cap max height to 125pt for exact 5-page layout
                        if target_h > 125:
                            target_h = 125
                            target_w = target_h / aspect_ratio
                        
                        story.append(Spacer(1, 2))
                        story.append(RLImage(bw_img_p, width=target_w, height=target_h))
                        story.append(Spacer(1, 3))
                    except Exception as img_err:
                        print(f"Error processing image: {img_err}")
            continue

        if raw.strip():
            story.append(Paragraph(format_inline_text(raw), body_style))

    if table_lines:
        flush_table()

    doc.build(story)
    print(f"Generated PDF (+3pt font size increase): {pdf_path}")

if __name__ == '__main__':
    docs_dir = '/Users/justin/Public/projects/CRT/docs'
    pdf_dir = os.path.join(docs_dir, 'PDFs')
    os.makedirs(pdf_dir, exist_ok=True)
    
    md_files = glob.glob(os.path.join(docs_dir, '*.md'))
    for md_f in md_files:
        base_name = os.path.basename(md_f)[:-3] + '.pdf'
        pdf_f = os.path.join(pdf_dir, base_name)
        try:
            convert_md_to_pdf(md_f, pdf_f)
            convert_md_to_pdf(md_f, md_f[:-3] + '.pdf')
        except Exception as e:
            print(f"Error converting {md_f}: {e}")
