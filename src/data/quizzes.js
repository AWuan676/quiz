/**
 * Mock question banks (bilingual). Replace with your own JSON in the same shape.
 *
 * Convergent Clues: 4 hints ordered vague → giveaway, one typed answer.
 *   accept: every spelling that should score (matched leniently, see lib/scoring.js)
 * Standard Quiz: 1 prompt, 4 options, `correct` is the option index (0 = A).
 */

export const CLUE_QUESTIONS = [
  {
    id: 'c1',
    category: { vi: 'Một địa danh', en: 'A place' },
    hints: [
      { vi: 'Được UNESCO công nhận là Di sản Thiên nhiên Thế giới năm 1994.', en: 'Listed as a UNESCO World Natural Heritage Site in 1994.' },
      { vi: 'Có gần 2.000 hòn đảo, phần lớn là đá vôi.', en: 'Home to nearly 2,000 islands, most of them limestone.' },
      { vi: 'Nằm ở tỉnh Quảng Ninh.', en: 'It lies in Quảng Ninh province.' },
      { vi: 'Tên gọi bắt nguồn từ truyền thuyết rồng hạ xuống biển.', en: 'Its name comes from a legend of dragons descending to the sea.' },
    ],
    answer: { vi: 'Vịnh Hạ Long', en: 'Ha Long Bay' },
    accept: ['Vịnh Hạ Long', 'Hạ Long', 'Ha Long Bay', 'Halong Bay', 'Halong'],
  },
  {
    id: 'c2',
    category: { vi: 'Một nhân vật', en: 'A person' },
    hints: [
      { vi: 'Sinh ra ở Warsaw nhưng làm việc gần như cả đời ở Paris.', en: 'Born in Warsaw, worked most of her life in Paris.' },
      { vi: 'Bà đặt tên cho hiện tượng mà mình nghiên cứu: phóng xạ.', en: 'She named the phenomenon she studied: radioactivity.' },
      { vi: 'Phát hiện ra hai nguyên tố polonium và radium.', en: 'Discovered the elements polonium and radium.' },
      { vi: 'Người đầu tiên đoạt giải Nobel ở hai lĩnh vực khác nhau.', en: 'First person to win Nobel Prizes in two different sciences.' },
    ],
    answer: { vi: 'Marie Curie', en: 'Marie Curie' },
    accept: ['Marie Curie', 'Curie', 'Maria Sklodowska', 'Marie Sklodowska Curie', 'Bà Curie'],
  },
  {
    id: 'c3',
    category: { vi: 'Một công nghệ', en: 'A technology' },
    hints: [
      { vi: 'Ra đời năm 2009, ngay sau khủng hoảng tài chính toàn cầu.', en: 'Launched in 2009, right after the global financial crisis.' },
      { vi: 'Người tạo ra nó đến nay vẫn ẩn danh.', en: 'Its creator remains anonymous to this day.' },
      { vi: 'Tổng cung bị giới hạn ở 21 triệu đơn vị.', en: 'Total supply is capped at 21 million units.' },
      { vi: 'Đồng tiền mã hóa đầu tiên trên thế giới.', en: 'The world’s first cryptocurrency.' },
    ],
    answer: { vi: 'Bitcoin', en: 'Bitcoin' },
    accept: ['Bitcoin', 'BTC'],
  },
  {
    id: 'c4',
    category: { vi: 'Một món ăn', en: 'A dish' },
    hints: [
      { vi: 'Xuất hiện ở miền Bắc Việt Nam vào đầu thế kỷ 20.', en: 'Appeared in northern Vietnam in the early 20th century.' },
      { vi: 'Nước dùng ninh nhiều giờ với hoa hồi, quế và gừng nướng.', en: 'Its broth simmers for hours with star anise, cinnamon and charred ginger.' },
      { vi: 'Có hai trường phái nổi tiếng: Nam Định và Hà Nội.', en: 'Two famous schools: Nam Định style and Hà Nội style.' },
      { vi: 'Bánh, nước dùng, thịt bò hoặc gà, ăn kèm rau thơm.', en: 'Rice noodles, broth, beef or chicken, fresh herbs.' },
    ],
    answer: { vi: 'Phở', en: 'Phở' },
    accept: ['Phở', 'Pho', 'Phở bò', 'Phở gà', 'Pho bo', 'Pho ga'],
  },
  {
    id: 'c5',
    category: { vi: 'Một quá trình', en: 'A process' },
    hints: [
      { vi: 'Đang diễn ra hàng tỷ lần mỗi giây quanh bạn.', en: 'It is happening billions of times a second around you.' },
      { vi: 'Cần ánh sáng, nước và khí CO₂.', en: 'It needs light, water and CO₂.' },
      { vi: 'Diễn ra trong lục lạp.', en: 'It takes place in chloroplasts.' },
      { vi: 'Quá trình cây xanh tạo ra oxy.', en: 'How green plants make oxygen.' },
    ],
    answer: { vi: 'Quang hợp', en: 'Photosynthesis' },
    accept: ['Quang hợp', 'Photosynthesis', 'Su quang hop'],
  },
]

export const STANDARD_QUESTIONS = [
  {
    id: 's1',
    prompt: { vi: 'Ngôn ngữ nào chạy trực tiếp trong trình duyệt web mà không cần biên dịch trước?', en: 'Which language runs directly in a web browser without compiling first?' },
    options: [
      { vi: 'Python', en: 'Python' },
      { vi: 'JavaScript', en: 'JavaScript' },
      { vi: 'C++', en: 'C++' },
      { vi: 'Java', en: 'Java' },
    ],
    correct: 1,
  },
  {
    id: 's2',
    prompt: { vi: 'Ngày 2/9/1945, Tuyên ngôn Độc lập được đọc tại đâu?', en: 'Where was the Declaration of Independence read on 2 September 1945?' },
    options: [
      { vi: 'Quảng trường Ba Đình', en: 'Ba Đình Square' },
      { vi: 'Hồ Hoàn Kiếm', en: 'Hoàn Kiếm Lake' },
      { vi: 'Nhà hát Lớn Hà Nội', en: 'Hanoi Opera House' },
      { vi: 'Văn Miếu', en: 'Temple of Literature' },
    ],
    correct: 0,
  },
  {
    id: 's3',
    prompt: { vi: 'Đơn vị đo cường độ dòng điện trong hệ SI là gì?', en: 'What is the SI unit of electric current?' },
    options: [
      { vi: 'Vôn (V)', en: 'Volt (V)' },
      { vi: 'Ôm (Ω)', en: 'Ohm (Ω)' },
      { vi: 'Ampe (A)', en: 'Ampere (A)' },
      { vi: 'Oát (W)', en: 'Watt (W)' },
    ],
    correct: 2,
  },
  {
    id: 's4',
    prompt: { vi: '“Truyện Kiều” là tác phẩm của ai?', en: 'Who wrote “The Tale of Kiều”?' },
    options: [
      { vi: 'Hồ Xuân Hương', en: 'Hồ Xuân Hương' },
      { vi: 'Nguyễn Trãi', en: 'Nguyễn Trãi' },
      { vi: 'Nam Cao', en: 'Nam Cao' },
      { vi: 'Nguyễn Du', en: 'Nguyễn Du' },
    ],
    correct: 3,
  },
  {
    id: 's5',
    prompt: { vi: 'Trong kinh tế học, lạm phát là gì?', en: 'In economics, what is inflation?' },
    options: [
      { vi: 'GDP thực tế tăng', en: 'Real GDP rising' },
      { vi: 'Mức giá chung tăng liên tục theo thời gian', en: 'A sustained rise in the general price level' },
      { vi: 'Đồng nội tệ tăng giá', en: 'The local currency appreciating' },
      { vi: 'Tỷ lệ thất nghiệp giảm', en: 'Unemployment falling' },
    ],
    correct: 1,
  },
  {
    id: 's6',
    prompt: { vi: 'Nguyên tố có ký hiệu hóa học “Fe” là gì?', en: 'Which element has the chemical symbol “Fe”?' },
    options: [
      { vi: 'Đồng', en: 'Copper' },
      { vi: 'Sắt', en: 'Iron' },
      { vi: 'Chì', en: 'Lead' },
      { vi: 'Kẽm', en: 'Zinc' },
    ],
    correct: 1,
  },
]

export const MODES = {
  clues: { id: 'clues', questions: CLUE_QUESTIONS },
  standard: { id: 'standard', questions: STANDARD_QUESTIONS },
}

export const TIME_OPTIONS = [20, 30, 45, 60, 90]
