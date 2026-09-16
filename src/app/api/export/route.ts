import { NextResponse } from 'next/server';
import PptxGenJS from 'pptxgenjs';
import { Presentation, SlideElement } from '@/types/studio';

const PX_TO_INCH = 96;

function px(pixels: number) {
  return pixels / PX_TO_INCH;
}

function stripHash(color?: string) {
  if (!color) return '000000';
  return color.replace('#', '');
}

export async function POST(req: Request) {
  try {
    const { presentation }: { presentation: Presentation } = await req.json();

    if (!presentation || !presentation.slides) {
      return NextResponse.json({ error: 'Invalid presentation data' }, { status: 400 });
    }

    // Initialize PPTX
    const pres = new PptxGenJS();
    
    // Set custom layout to perfectly match our 1280x720 canvas at 96 DPI
    pres.defineLayout({ name: 'MINEINTEL', width: 13.33, height: 7.5 });
    pres.layout = 'MINEINTEL';

    // Loop over slides
    for (const slideData of presentation.slides) {
      const slide = pres.addSlide();
      
      // Set Slide Background
      slide.background = { color: stripHash(slideData.background || '#F1ECE3') };

      // Sort elements by zIndex to render properly
      const elements = [...slideData.elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

      for (const el of elements) {
        const x = px(el.x);
        const y = px(el.y);
        const w = px(el.width);
        const h = px(el.height);
        // Note: rotation needs to be mapped if used, pptxgenjs uses `rotate: degrees`

        if (el.type === 'TEXT') {
          const textEl = el as any;
          
          slide.addText(textEl.content, {
            x, y, w, h,
            fontSize: textEl.fontSize ? textEl.fontSize * 0.75 : 18,
            fontFace: textEl.fontFamily || 'Arial',
            color: stripHash(textEl.color),
            bold: textEl.fontWeight === 'bold',
            align: textEl.textAlign === 'center' ? 'center' : (textEl.textAlign === 'right' ? 'right' : 'left'),
            valign: 'top',
            rotate: el.rotation || 0,
          });
        } 
        else if (el.type === 'SHAPE') {
          const shapeEl = el as any;
          // Map to PptxGenJS shape
          let shapeType = pres.ShapeType.rect;
          if (shapeEl.shapeType === 'circle') shapeType = pres.ShapeType.ellipse;
          
          slide.addShape(shapeType, {
            x, y, w, h,
            fill: { color: stripHash(shapeEl.fill) },
            line: shapeEl.strokeWidth && shapeEl.strokeWidth > 0 ? { color: stripHash(shapeEl.stroke), width: shapeEl.strokeWidth } : undefined,
            rectRadius: shapeEl.cornerRadius ? px(shapeEl.cornerRadius) : 0,
            rotate: el.rotation || 0,
          });
        }
        else if (el.type === 'IMAGE') {
          const imageEl = el as any;
          // If URL is an external placeholder or image, pptxgenjs can fetch it or we provide path.
          // Note: fetching external images server-side in PptxGenJS can be finicky if not https, but placehold.co is fine.
          // For safety, we wrap in try/catch or just pass the URL directly.
          slide.addImage({
            path: imageEl.url,
            x, y, w, h,
            rotate: el.rotation || 0,
            sizing: { type: 'contain', w, h }
          });
        }
      }
    }

    // Generate output
    const buffer = await pres.write({ outputType: 'nodebuffer' }) as Buffer;

    // Return as downloadable file
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${presentation.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pptx"`,
      },
    });

  } catch (err: any) {
    console.error('PPTX Export Error:', err);
    return NextResponse.json({ error: 'Failed to generate presentation', details: err.message }, { status: 500 });
  }
}
