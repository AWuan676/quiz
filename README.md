# Matchday Quiz

Ứng dụng đố vui trên lớp theo thời gian thực (giống Kahoot/Quizizz), phong cách **bảng tỉ số sân vận động**. Giao diện song ngữ Việt / Anh.

## Chạy thử

1. Cài **Node.js 20 trở lên** từ https://nodejs.org (chọn bản LTS).
2. Mở terminal trong thư mục này rồi chạy:

```bash
npm install
```

```bash
npm run dev
```

3. Mở `http://localhost:5173` ở **hai tab** trong cùng trình duyệt:
   - Tab 1: bấm **Tạo phòng**, chọn kiểu chơi, thời gian, rồi **Mở phòng**.
   - Tab 2 (hoặc bấm nút **Tab người chơi** ở phòng chờ): nhập mã 6 số, đặt tên đội.
   - Mở thêm tab để có thêm đội. Quay lại tab 1 và bấm **Bắt đầu**.

Phím tắt trên màn hình host: `H` mở gợi ý tiếp, `A` hoặc `Space` hiện đáp án, `N` hoặc `→` sang câu tiếp.

## Giới hạn quan trọng

`BroadcastChannel` chỉ đồng bộ **các tab trong cùng một trình duyệt, trên cùng một máy**. Điện thoại quét mã QR vẫn mở được màn hình vào phòng (dev server chạy với `host: true`, nên dùng địa chỉ IP LAN thay cho `localhost`), nhưng **không đồng bộ được** với máy host cho tới khi bạn thay bằng backend thời gian thực thật.

Để chuyển sang nhiều thiết bị, chỉ cần sửa hàm `openTransport` trong [src/hooks/useMultiplayerSync.js](src/hooks/useMultiplayerSync.js) để dùng WebSocket / Socket.IO / Supabase Realtime / Firebase / PartyKit, giữ nguyên dạng `{ post(msg), close() }`. Phần còn lại của app không cần đổi.

## Cấu trúc

```
src/
  App.jsx                    Định tuyến: /  /host  /join/:code
  Landing.jsx                Trang chủ: Tổ chức trận | Vào sân
  hooks/useMultiplayerSync.js  BroadcastChannel + danh sách sự kiện (EVENTS)
  host/
    useHostGame.js           Trạng thái host (reducer), chấm điểm, phát snapshot
    Setup.jsx                Chọn kiểu chơi + thời gian
    Lobby.jsx                Mã phòng LED, mã QR, danh sách đội
    Game.jsx                 Câu hỏi / gợi ý, đồng hồ, bảng điểm, nút điều khiển
    Final.jsx                Bục vinh quang + bảng xếp hạng
  player/
    usePlayerGame.js         Máy trạng thái người chơi
    JoinScreens.jsx          Nhập mã, đặt tên đội
    PlayScreens.jsx          Chờ, tay cầm A/B/C/D hoặc ô gõ đáp án, đúng/sai, xếp hạng
  data/quizzes.js            Câu hỏi mẫu song ngữ (thay bằng dữ liệu của bạn)
  lib/scoring.js             Công thức điểm + so khớp đáp án linh hoạt
  lib/i18n.jsx               Từ điển Việt / Anh
  components/                SevenSeg (số LED), ShotClock, Ticker, Podium...
```

## Luồng sự kiện

Host là nguồn sự thật duy nhất. Người chơi chỉ *gửi yêu cầu*, host quyết định rồi phát lại snapshot công khai (không chứa đáp án cho tới khi công bố).

| Sự kiện | Chiều | Ý nghĩa |
|---|---|---|
| `ROOM_CREATED` | host → tất cả | Phòng mở, bắt đầu nhận đội |
| `REQUEST_STATE` / `STATE_SYNC` | người chơi ↔ host | Kiểm tra mã phòng, đồng bộ lại |
| `PLAYER_JOINED` | người chơi → host, rồi host → tất cả | Đội xin vào, host duyệt và phát lại |
| `JOIN_ACCEPTED` / `JOIN_REJECTED` | host → 1 đội | Trùng tên, phòng đầy... |
| `GAME_STARTED`, `NEXT_QUESTION` | host → tất cả | Mở câu hỏi, kèm `startedAt` để đồng hồ khớp nhau |
| `HINT_REVEALED` | host → tất cả | Mở gợi ý tiếp (Gợi ý hội tụ) |
| `PLAYER_ANSWERED` | người chơi → host | Host tự tính điểm theo đồng hồ của host |
| `ANSWER_RESULT` | host → 1 đội | Đúng/sai + điểm, hiện ngay trên điện thoại |
| `ANSWER_REVEALED` | host → tất cả | Công bố đáp án, cộng điểm vào bảng |
| `GAME_ENDED`, `ROOM_CLOSED` | host → tất cả | Kết thúc trận / đóng phòng |

## Chấm điểm

`Điểm = round(1000 × thời gian còn lại ÷ tổng thời gian)`, hết giờ là 0. Mỗi đội chỉ được chốt **một** đáp án mỗi câu. Điểm được cộng vào bảng khi host bấm **Hiện đáp án**, để màn hình lớn không lộ đội nào đã đúng.

Ở kiểu **Gợi ý hội tụ**, đáp án được so khớp linh hoạt: không phân biệt hoa/thường, có dấu/không dấu (kể cả `đ`), khoảng trắng, chấp nhận các cách viết trong `accept`, và cho phép sai 1 ký tự (từ 5 ký tự) hoặc 2 ký tự (từ 10 ký tự).
