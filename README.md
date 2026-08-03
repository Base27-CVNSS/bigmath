<div align="center">

# 🧩 BigMath — Bản đồ Bài toán lớn Việt Nam

**Kho dữ liệu mở để lưu trữ, thống kê và tra cứu các bài toán lớn về khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số.**

[![Dữ liệu](https://img.shields.io/badge/dữ_liệu-76_bài_toán-0A66C2?style=for-the-badge)](#-phạm-vi-dữ-liệu)
[![Văn bản](https://img.shields.io/badge/nguồn-5_văn_bản-20B8CD?style=for-the-badge)](#-kho-văn-bản)
[![Thời gian](https://img.shields.io/badge/giai_đoạn-2025–2026-F0B44D?style=for-the-badge)](#-phạm-vi-dữ-liệu)
[![Website](https://img.shields.io/badge/website-GitHub_Pages-071A2F?style=for-the-badge&logo=github)](https://base27-cvnss.github.io/bigmath/)
[![License](https://img.shields.io/badge/code-MIT-2E8B57?style=for-the-badge)](LICENSE)

[🌐 Mở dashboard](https://base27-cvnss.github.io/bigmath/) · [📄 Xem kho PDF](documents/) · [🧭 Phương pháp dữ liệu](#-phương-pháp-thống-kê)

</div>

---

## 🎯 BigMath là gì?

BigMath biến các phụ lục PDF dài và khó tra cứu thành một **danh mục dữ liệu có cấu trúc**. Người dùng có thể tìm kiếm theo tên bài toán, cơ quan, địa phương, năm, lĩnh vực; xem phân bố thống kê; mở văn bản gốc; hoặc xuất kết quả đang lọc ra CSV.

Tên “BigMath” ở đây mang nghĩa **Big Problems** — các bài toán phát triển quy mô lớn cần huy động khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số để giải quyết.

> [!IMPORTANT]
> Dashboard là công cụ tra cứu độc lập. Văn bản PDF của cơ quan ban hành là nguồn có giá trị đối chiếu. Nhãn lĩnh vực trên website chỉ phục vụ tìm kiếm, không thay thế phân loại pháp lý hoặc nội dung chính thức.

## ✨ Chức năng nổi bật

- 🔎 Tìm kiếm tiếng Việt không phụ thuộc dấu theo tên, đơn vị, lĩnh vực và địa phương.
- 🧭 Lọc đồng thời theo nguồn văn bản, năm ban hành và lĩnh vực.
- 📊 Thống kê phân bố giữa Bộ Khoa học và Công nghệ và bốn địa phương.
- 🗂️ Liên kết trực tiếp từng dòng dữ liệu với văn bản PDF tương ứng.
- ⭐ Tách riêng 8 bài toán ưu tiên của An Giang để tránh cộng trùng.
- ⇩ Xuất danh sách sau khi lọc thành CSV UTF-8, mở tốt trong Excel.
- 📱 Giao diện responsive, hỗ trợ bàn phím và chế độ giảm chuyển động.
- 📴 Không dùng framework hoặc thư viện biểu đồ bên ngoài; có thể mở cục bộ.

## 📊 Phạm vi dữ liệu

| Cấp | Cơ quan/địa phương | Văn bản | Bài toán chính | Ưu tiên riêng |
|---|---|---:|---:|---:|
| 🏛️ Bộ ngành | Bộ Khoa học và Công nghệ | 1144/QĐ-BKHCN | 21 | — |
| 🌆 Địa phương | Thành phố Hồ Chí Minh | 3572/UBND-KT | 14 | — |
| 🌾 Địa phương | Tỉnh Vĩnh Long | 3552/UBND-VX | 9 | — |
| 🌉 Địa phương | Thành phố Cần Thơ | 1424/QĐ-UBND | 12 | — |
| 🌊 Địa phương | Tỉnh An Giang | 259/TB-UBND | 20 | 8 |
| **Tổng** | **5 nguồn** | **5 PDF** | **76** | **8** |

Tổng **76** chỉ bao gồm các dòng thuộc danh mục chính. Tám mục ở Phụ lục 2 của An Giang được hiển thị trong khu vực “ưu tiên đặt hàng” nhưng không cộng thêm vào tổng chính.

## 🧠 Bản chất dữ liệu

```mermaid
flowchart LR
    A["PDF chính thức"] --> B["Chuẩn hóa metadata"]
    B --> C["Danh mục dữ liệu"]
    C --> D["Dashboard tra cứu"]
    C --> E["Xuất CSV"]
```

Mỗi bản ghi chính lưu các trường cốt lõi: mã nội bộ, số thứ tự trong phụ lục, năm, nguồn, cơ quan/địa phương, đơn vị chủ trì hoặc đề xuất, nhãn lĩnh vực tham khảo và nguyên văn tên bài toán.

## 🗂️ Kho văn bản

Các tệp được chia theo cấp quản lý và đổi tên theo quy ước nhất quán:

```text
documents/
├── bo-nganh/
│   └── bo-khoa-hoc-va-cong-nghe/
└── dia-phuong/
    ├── tinh-an-giang/
    ├── tinh-vinh-long/
    ├── tp-can-tho/
    └── tp-ho-chi-minh/
```

Quy ước tên tệp:

```text
YYYY-MM-DD_LOAI-SO-COQUAN_noi-dung-ngan-gon.pdf
```

Ví dụ:

```text
2026-04-06_QD-1424-QD-UBND_danh-muc-bai-toan-lon-dot-1.pdf
```

Xem [bảng kiểm kê và ánh xạ tên tệp](documents/README.md) để biết tên gốc, tên mới, số trang và phạm vi từng văn bản.

## 🚀 Chạy cục bộ

Không cần cài framework. Do trình duyệt có thể giới hạn một số thao tác khi mở bằng `file://`, nên dùng một máy chủ tĩnh nhỏ:

```bash
git clone https://github.com/Base27-CVNSS/bigmath.git
cd bigmath
python -m http.server 8080
```

Mở `http://localhost:8080`.

## 🌐 Xuất bản GitHub Pages

Sau khi nhánh thay đổi được hợp nhất vào `main`:

1. Mở **Settings → Pages** trong kho GitHub.
2. Ở **Build and deployment**, chọn **Deploy from a branch**.
3. Chọn nhánh `main`, thư mục `/ (root)`, rồi **Save**.
4. Website sẽ có địa chỉ: `https://base27-cvnss.github.io/bigmath/`.

## 🧭 Phương pháp thống kê

1. **Xác minh văn bản:** đọc số, ngày, cơ quan ban hành, số trang và cấu trúc phụ lục.
2. **Bóc tách danh mục chính:** mỗi dòng đánh số trong danh mục chính được tính là một bài toán.
3. **Giữ nguyên tên:** tiêu đề bài toán bám theo nội dung PDF; chỉ chuẩn hóa khoảng trắng và lỗi ngắt trang khi cần.
4. **Tách ưu tiên:** phụ lục ưu tiên của An Giang được lưu riêng để không làm sai tổng chính.
5. **Gắn nhãn tham khảo:** lĩnh vực được thêm để hỗ trợ lọc, không phải thuộc tính pháp lý.
6. **Liên kết nguồn:** mỗi bản ghi luôn trỏ lại PDF đã lưu trong kho.

## 🏗️ Cấu trúc mã nguồn

```text
bigmath/
├── index.html              # Giao diện dashboard
├── assets/
│   ├── app.js              # Tìm kiếm, lọc, biểu đồ và xuất CSV
│   ├── data.js             # 76 bản ghi chính + 8 mục ưu tiên
│   └── styles.css          # Hệ thống thiết kế responsive
├── documents/              # Kho PDF đã chuẩn hóa tên
├── .nojekyll               # Phục vụ GitHub Pages trực tiếp
├── LICENSE                 # MIT cho phần mã nguồn
└── README.md
```

## 🤝 Bổ sung văn bản mới

Khi thêm một Bộ, ngành hoặc địa phương:

1. Xác minh PDF và cơ quan ban hành.
2. Đặt tệp vào đúng nhánh thư mục, theo [quy ước lưu trữ](documents/README.md).
3. Thêm metadata văn bản và các dòng danh mục vào `assets/data.js`.
4. Kiểm tra tổng số, liên kết PDF, bộ lọc và CSV.
5. Ghi rõ cách xử lý nếu văn bản có danh mục phụ, danh mục ưu tiên hoặc dòng trùng.

## ⚖️ Bản quyền và nguồn

- Phần mã HTML/CSS/JavaScript của dự án được phát hành theo [MIT License](LICENSE).
- Các PDF là văn bản của cơ quan nhà nước tương ứng; dự án lưu bản sao để tra cứu và giữ nguyên thông tin nguồn.
- Khi sử dụng cho hồ sơ, nghiên cứu hoặc quyết định chính thức, cần kiểm tra lại văn bản trên cổng thông tin của cơ quan ban hành.

---

<div align="center">

**BigMath · Biến phụ lục tĩnh thành dữ liệu có thể tìm kiếm**

Được duy trì tại [Base27-CVNSS/bigmath](https://github.com/Base27-CVNSS/bigmath)

</div>
