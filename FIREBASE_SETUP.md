# Kết nối Firebase (khoảng 10 phút, miễn phí)

App cần Firebase để: đăng nhập Google, lưu quiz trên mây, và cho điện thoại ở máy khác vào phòng.
Gói miễn phí (Spark) là đủ cho một lớp học.

## 1. Tạo dự án

1. Vào https://console.firebase.google.com và đăng nhập bằng tài khoản Google của bạn.
2. Bấm **Create a project** (Tạo dự án), đặt tên ví dụ `quizmap`.
3. Có thể tắt Google Analytics, rồi bấm **Create project**.

## 2. Bật đăng nhập

1. Menu trái: **Build → Authentication → Get started**.
2. Tab **Sign-in method**:
   - Chọn **Google** → bật **Enable** → chọn email hỗ trợ → **Save**.
   - Chọn **Anonymous** (Ẩn danh) → bật **Enable** → **Save**. Học viên vào phòng bằng cách này nên không cần tài khoản.
3. Tab **Settings → Authorized domains** → **Add domain** → nhập `awuan676.github.io` → **Add**.

## 3. Tạo Firestore (nơi lưu quiz)

1. Menu trái: **Build → Firestore Database → Create database**.
2. Chọn vị trí **asia-southeast1 (Singapore)**, chế độ **production mode** → **Create**.
3. Mở tab **Rules**, xóa hết nội dung cũ, dán toàn bộ nội dung file `firestore.rules` trong thư mục dự án → **Publish**.

## 4. Tạo Realtime Database (nơi chạy phòng chơi)

1. Menu trái: **Build → Realtime Database → Create Database**.
2. Chọn vị trí **Singapore (asia-southeast1)**, chế độ **locked mode** → **Enable**.
3. Mở tab **Rules**, xóa hết, dán toàn bộ nội dung file `database.rules.json` → **Publish**.
4. Ở tab **Data**, chép lại đường dẫn ở trên cùng, dạng `https://quizmap-xxxx-default-rtdb.asia-southeast1.firebasedatabase.app`.

## 5. Lấy cấu hình web

1. Bấm bánh răng cạnh **Project Overview** → **Project settings**.
2. Kéo xuống **Your apps** → bấm biểu tượng web **`</>`** → đặt tên app (ví dụ `quizmap-web`) → **Register app** (không cần bật Hosting).
3. Firebase hiện một đoạn `const firebaseConfig = { ... }`. Chép phần trong dấu `{ }`.
4. Nếu đoạn đó **không có** dòng `databaseURL`, thêm dòng đó bằng đường dẫn ở bước 4.4.

## 6. Dán vào app

Mở `src/firebaseConfig.js`, thay các giá trị `PASTE_...` bằng giá trị của bạn, lưu lại, rồi tải file đó lên GitHub (thư mục `src`).

Các giá trị này **không phải mật khẩu**: Firebase thiết kế chúng để nằm công khai trong trang web. Dữ liệu được bảo vệ bằng các quy tắc ở bước 3 và 4.

## Kiểm tra

- Mở `https://awuan676.github.io/quiz/host` → **Đăng nhập với Google** → **Soạn quiz mới**.
- Bấm **Chơi** → **Mở phòng** → dùng điện thoại quét mã QR trên màn hình.
