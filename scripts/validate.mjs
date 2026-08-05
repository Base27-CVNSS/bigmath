import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const sandbox = { window: {} };
vm.runInNewContext(readFileSync(resolve(root, 'assets/data.js'), 'utf8'), sandbox);
const data = sandbox.window.BIGMATH_DATA;
const manifest = JSON.parse(readFileSync(resolve(root, 'documents/manifest.json'), 'utf8'));

assert(Boolean(data), 'Không nạp được BIGMATH_DATA.');
assert(data.updated === manifest.updated, 'Ngày cập nhật giữa data.js và manifest.json không khớp.');
assert(data.documents.length === manifest.summary.documents, 'Tổng số văn bản không khớp manifest.');
assert(data.problems.length === manifest.summary.primaryProblems, 'Tổng số bài toán chính không khớp manifest.');
assert(data.priorities.length === manifest.summary.priorityProblems, 'Tổng số mục ưu tiên không khớp manifest.');

const unique = (items, key, label) => {
  const values = items.map((item) => item[key]);
  assert(new Set(values).size === values.length, `${label} có giá trị ${key} bị trùng.`);
};

unique(data.documents, 'id', 'Danh mục văn bản');
unique(data.problems, 'id', 'Danh mục bài toán chính');
unique(data.priorities, 'id', 'Danh mục ưu tiên');

const documentsById = new Map(data.documents.map((doc) => [doc.id, doc]));
const manifestById = new Map(manifest.documents.map((doc) => [doc.id, doc]));

for (const item of [...data.problems, ...data.priorities]) {
  assert(documentsById.has(item.source), `${item.id} tham chiếu nguồn không tồn tại: ${item.source}.`);
  for (const key of ['id', 'source', 'authority', 'field', 'title', 'year']) {
    assert(item[key] !== undefined && item[key] !== '', `${item.id} thiếu trường ${key}.`);
  }
}

for (const doc of data.documents) {
  const rows = data.problems.filter((item) => item.source === doc.id).sort((a, b) => a.ordinal - b.ordinal);
  const expectedOrdinals = Array.from({ length: doc.primaryCount }, (_, index) => index + 1);
  assert(rows.length === doc.primaryCount, `${doc.number} có ${rows.length}/${doc.primaryCount} bài toán chính.`);
  assert(rows.map((item) => item.ordinal).join(',') === expectedOrdinals.join(','), `${doc.number} có số thứ tự thiếu hoặc trùng.`);

  const archive = manifestById.get(doc.id);
  assert(Boolean(archive), `${doc.number} chưa có trong manifest.`);
  if (!archive) continue;

  assert(archive.path === doc.path, `${doc.number} có đường dẫn khác giữa data.js và manifest.`);
  assert(archive.pages === doc.pages, `${doc.number} có số trang khác giữa data.js và manifest.`);
  assert(archive.primaryCount === doc.primaryCount, `${doc.number} có tổng bài toán khác giữa data.js và manifest.`);
  assert(archive.priorityCount === doc.priorityCount, `${doc.number} có tổng ưu tiên khác giữa data.js và manifest.`);
  assert(doc.level === 'Bộ ngành' ? doc.path.startsWith('documents/bo-nganh/') : doc.path.startsWith('documents/dia-phuong/'), `${doc.number} nằm sai nhánh thư mục.`);
  assert(!/[\s\u0080-\uFFFF]/u.test(doc.path), `${doc.number} có đường dẫn chứa khoảng trắng hoặc ký tự ngoài ASCII.`);

  const file = resolve(root, doc.path);
  assert(existsSync(file), `${doc.number} thiếu tệp PDF: ${doc.path}.`);
  if (!existsSync(file)) continue;

  const bytes = statSync(file).size;
  const sha256 = createHash('sha256').update(readFileSync(file)).digest('hex');
  assert(bytes === archive.sizeBytes, `${doc.number} sai dung lượng: ${bytes}/${archive.sizeBytes} byte.`);
  assert(sha256 === archive.sha256, `${doc.number} sai SHA-256.`);
}

const pages = data.documents.reduce((sum, doc) => sum + doc.pages, 0);
assert(pages === manifest.summary.pages, `Tổng số trang là ${pages}/${manifest.summary.pages}.`);
assert(manifest.documents.length === data.documents.length, 'Manifest có thừa hoặc thiếu văn bản.');

if (failures.length) {
  console.error(`BigMath chưa hợp lệ (${failures.length} lỗi):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`✓ BigMath hợp lệ: ${data.documents.length} văn bản · ${data.problems.length} bài toán chính · ${data.priorities.length} mục ưu tiên · ${pages} trang PDF`);
