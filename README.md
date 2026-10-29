# Quizmap

Ứng dụng đố vui trên lớp theo thời gian thực (giống Kahoot/Quizizz), giao diện tối giản kiểu **bản đồ công viên**, song ngữ Việt / Anh.

- **Giảng viên:** đăng nhập Google, soạn và lưu quiz (Gợi ý hội tụ hoặc Trắc nghiệm, số câu tùy ý), mở phòng, chiếu mã phòng và mã QR.
- **Học viên:** quét QR bằng điện thoại, đặt tên, vào phòng chờ, bấm vào avatar người khác để mời ghép đội, đọc hướng dẫn cách chơi, rồi trả lời.
- **Tính điểm:** `1000 × thời gian còn lại ÷ tổng thời gian`, dựa trên đồng hồ máy chủ. Mỗi đội chốt một lần, ai trong đội bấm trước tính cho cả đội.

## Cài đặt lần đầu

1. Làm theo [FIREBASE_SETUP.md](FIREBASE_SETUP.md) để tạo dự án Firebase và dán cấu hình vào `src/firebaseConfig.js`.
2. Đưa code lên GitHub. Workflow `.github/workflows/deploy.yml` tự build và đăng lên GitHub Pages (Settings → Pages → Source: **GitHub Actions**).

Chạy trên máy (cần Node.js 20 trở lên):

```bash
npm install
```

```bash
npm run dev
```

## Cấu trúc

```
src/
  App.jsx                  Định tuyến: /  /host  /host/edit/:id  /host/room/:code  /join/:code
  firebaseConfig.js        Cấu hình Firebase của bạn
  lib/firebase.js          Khởi tạo Firebase (host: Google, người chơi: ẩn danh theo từng tab)
  lib/quizStore.js         Lưu quiz trên Firestore, bộ mẫu, kiểm tra câu hỏi
  lib/room.js              Cấu trúc phòng trên Realtime Database, đồng hồ máy chủ, gom đội
  host/Library.jsx         Danh sách quiz, tạo quiz mới, mở phòng (chọn số người mỗi đội)
  host/Editor.jsx          Soạn câu hỏi
  host/useHostRoom.js      Trọng tài: chấm đáp án, công bố kết quả, cộng điểm
  host/Lobby|Game|Final    Màn hình máy chiếu
  player/usePlayerRoom.js  Vào phòng, ghép đội (mời / đồng ý), trả lời
  player/LobbyScreen.jsx   Phòng chờ: đội của bạn, mọi người, hướng dẫn cách chơi
  data/quizzes.js          Câu hỏi mẫu song ngữ
database.rules.json        Quy tắc bảo mật Realtime Database
firestore.rules            Quy tắc bảo mật Firestore
```
