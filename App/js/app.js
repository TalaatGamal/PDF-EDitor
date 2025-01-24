const fileInput = document.getElementById('fileInput');
const replaceTextInput = document.getElementById('replaceText');
const addTextBtn = document.getElementById('addTextBtn');
const clearCanvasBtn = document.getElementById('clearCanvasBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const canvas = document.getElementById('pdfCanvas');
const ctx = canvas.getContext('2d');

let pdfDoc = null;
let pdfBytes = null;
let modifiedPdfDoc = null;

// إعداد PDF.js لعرض محتوى PDF
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// تحميل ملف PDF
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file || file.type !== 'application/pdf') {
    alert('يرجى اختيار ملف PDF صحيح.');
    return;
  }

  pdfBytes = await file.arrayBuffer();
  pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
  modifiedPdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

  renderPage();
});

// عرض الصفحة الأولى باستخدام PDF.js
async function renderPage() {
  const page = pdfDoc.getPage(0); // الصفحة الأولى
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

  canvas.width = pageWidth;
  canvas.height = pageHeight;

  const viewport = page.getViewport({ scale: 1.5 });
  const renderContext = {
    canvasContext: ctx,
    viewport: viewport,
  };

  // رسم الصفحة على الـ Canvas
  const renderTask = page.render(renderContext);
  await renderTask.promise;
}

// إضافة نص جديد باستخدام PDF-lib
addTextBtn.addEventListener('click', async () => {
  if (!modifiedPdfDoc) {
    alert('يرجى تحميل ملف PDF أولاً.');
    return;
  }

  const newText = replaceTextInput.value || 'النص البديل';
  const pages = modifiedPdfDoc.getPages();
  const firstPage = pages[0];

  // إضافة النص الجديد
  firstPage.drawText(newText, {
    x: 50,
    y: 400,
    size: 20,
    color: PDFLib.rgb(0, 0, 0),
  });

  alert('تم إضافة النص!');
});

// مسح التعديلات
clearCanvasBtn.addEventListener('click', async () => {
  renderPage(); // إعادة تحميل الصفحة بدون تعديلات
  alert('تم مسح التعديلات!');
});

// حفظ الملف المعدل
downloadPdfBtn.addEventListener('click', async () => {
  if (!modifiedPdfDoc) {
    alert('يرجى تحميل ملف PDF أولاً.');
    return;
  }

  const pdfBytes = await modifiedPdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'modified.pdf';
  link.click();
});
