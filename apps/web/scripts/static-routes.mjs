import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
await mkdir(new URL('../dist/lab/', import.meta.url), { recursive: true });
await copyFile(new URL('../dist/index.html', import.meta.url), new URL('../dist/lab/index.html', import.meta.url));

await mkdir(new URL('../dist/receiptrail/', import.meta.url), { recursive: true });
const receiptRailHtml = (await readFile(new URL('../dist/index.html', import.meta.url), 'utf8'))
  .replace(/<title>[^<]*<\/title>/, '<title>ReceiptRail · Demo hóa đơn SOL cục bộ</title>')
  .replace(/<meta name="description" content="[^"]*"/, '<meta name="description" content="Demo ReceiptRail với dữ liệu giả: tạo, thanh toán, hủy hóa đơn SOL và kiểm tra lại khi mất phản hồi. Không ký hoặc gửi giao dịch."');
await writeFile(new URL('../dist/receiptrail/index.html', import.meta.url), receiptRailHtml);
