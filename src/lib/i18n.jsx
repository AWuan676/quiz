import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { EXTRA } from './strings.js'

const dict = {
  vi: {
    'lang.label': 'Ngôn ngữ',
    'common.home': 'Trang chủ',
    'common.points': 'điểm',
    'common.pts': 'điểm',
    'common.seconds': '{n} giây',
    'common.sec': 'giây',

    'landing.title': 'Đố vui cả lớp, ngay trên điện thoại.',
    'landing.ticker1': 'Trả lời càng nhanh, điểm càng cao',
    'landing.ticker2': 'Tối đa 1000 điểm mỗi câu',
    'landing.ticker3': 'Gợi ý hội tụ hoặc trắc nghiệm',
    'landing.ticker4': 'Quét mã QR là vào sân',
    'landing.hostSide': 'Giảng viên · máy chiếu',
    'landing.hostTitle': 'Bạn là giảng viên?',
    'landing.hostBody': 'Tạo phòng, chiếu mã lên màn hình lớn, mở từng câu hỏi và công bố bảng xếp hạng.',
    'landing.hostCta': 'Tạo phòng',
    'landing.joinSide': 'Đội chơi · điện thoại',
    'landing.joinTitle': 'Vào sân',
    'landing.joinBody': 'Nhập mã phòng 6 số đang hiện trên màn hình lớn để vào chơi cùng đội của bạn.',
    'landing.joinCta': 'Vào phòng',
    'landing.tabTip': 'Thử trên một máy: mở trang này ở hai tab. Tab thứ nhất bấm “Tạo phòng”, tab thứ hai nhập mã để vào phòng. Hai tab tự đồng bộ với nhau.',

    'join.title': 'Vào phòng',
    'join.body': 'Nhập mã phòng 6 số trên màn hình của giảng viên.',
    'join.prefilled': 'Mã phòng đã được điền sẵn từ mã QR. Kiểm tra lại rồi bấm Vào phòng.',
    'join.codeLabel': 'Mã phòng',
    'join.checking': 'Đang tìm phòng',
    'join.cta': 'Vào phòng',

    'team.roomFound': 'Phòng {code}',
    'team.title': 'Tên đội',
    'team.body': 'Đặt tên cho đội của bạn. Tên này sẽ hiện trên màn hình lớn.',
    'team.label': 'Tên đội',
    'team.placeholder': 'Ví dụ: Lớp K65 Kinh tế',
    'team.joining': 'Đang vào phòng',
    'team.cta': 'Vào phòng',

    'wait.title': 'Chờ giảng viên bắt đầu',
    'wait.settingUp': 'Giảng viên đang chỉnh thiết lập',
    'wait.teams': '{n} đội trong phòng',

    'error.notFound': 'Không tìm thấy phòng này. Kiểm tra lại mã trên màn hình lớn.',
    'error.noHost': 'Máy chủ phòng không phản hồi. Hãy chắc rằng tab của giảng viên vẫn đang mở.',
    'error.empty': 'Hãy nhập tên đội.',
    'error.taken': 'Tên đội này đã có người dùng. Hãy chọn tên khác.',
    'error.full': 'Phòng đã đủ đội. Hãy nhờ giảng viên mở phòng mới.',
    'error.kicked': 'Đội của bạn đã bị gỡ khỏi phòng. Bạn có thể vào lại với tên khác.',

    'closed.title': 'Phòng đã đóng',
    'closed.body': 'Giảng viên đã kết thúc phòng này.',
    'closed.cta': 'Nhập mã khác',

    'host.closeRoom': 'Đóng phòng',
    'host.exitConfirm': 'Đóng phòng? Tất cả đội sẽ bị ngắt kết nối.',

    'setup.title': 'Thiết lập phòng',
    'setup.subtitle': 'Chọn kiểu chơi và thời gian cho mỗi câu. Bạn có thể đổi lại trước khi bắt đầu.',
    'setup.modeHeading': 'Kiểu chơi',
    'setup.questionCount': '{n} câu',
    'setup.maxPoints': 'tối đa 1000 điểm/câu',
    'setup.timeHeading': 'Thời gian mỗi câu',
    'setup.formulaLabel': 'Cách tính điểm',
    'setup.formula': 'Điểm = 1000 × thời gian còn lại ÷ tổng thời gian',
    'setup.demo': 'Thử xem: trả lời đúng sau {s} giây',
    'setup.demoPoints': '{n} điểm',
    'setup.ready': '{mode} · {s} giây mỗi câu',
    'setup.openRoom': 'Mở phòng',

    'mode.clues': 'Gợi ý hội tụ',
    'mode.clues.desc': '4 gợi ý mở dần về một đáp án. Các đội gõ đáp án bất cứ lúc nào: đoán sớm thì được nhiều điểm hơn.',
    'mode.standard': 'Trắc nghiệm',
    'mode.standard.desc': '1 câu hỏi, 4 lựa chọn A B C D. Chọn đúng càng nhanh, điểm càng cao.',

    'lobby.codeLabel': 'Mã phòng',
    'lobby.goTo': 'Vào',
    'lobby.andEnter': 'và nhập mã, hoặc quét mã QR.',
    'lobby.ticket': 'Mã QR',
    'lobby.gate': 'Cổng',
    'lobby.qrTitle': 'Mã QR vào phòng',
    'lobby.scan': 'Quét bằng Zalo hoặc Camera để vào phòng',
    'lobby.copy': 'Sao chép',
    'lobby.copied': 'Đã chép',
    'lobby.openPlayer': 'Tab người chơi',
    'lobby.teamsHeading': 'Các đội',
    'lobby.empty': 'Đang chờ đội đầu tiên',
    'lobby.kick': 'Gỡ đội {name}',
    'lobby.changeSettings': 'Đổi thiết lập',
    'lobby.readyCount': '{n} đội sẵn sàng',
    'lobby.needTeam': 'Cần ít nhất 1 đội để bắt đầu',
    'lobby.start': 'Bắt đầu',
    'lobby.tickerWaiting': 'Đang chờ các đội',
    'lobby.tickerCount': '{n} đội trong phòng',
    'lobby.tickerScan': 'Quét mã QR bằng Zalo hoặc Camera',
    'lobby.tickerCode': 'Mã phòng {code}',

    'game.question': 'Câu',
    'game.mode': 'Kiểu chơi',
    'game.livePoints': 'Điểm đang có',
    'game.livePointsAria': 'Trả lời đúng lúc này được {n} điểm',
    'game.timeLeft': 'Còn lại',
    'game.cluesPrompt': 'Đây là',
    'game.hintLocked': 'Gợi ý đang khóa',
    'game.answerIs': 'Đáp án',
    'game.standings': 'Bảng điểm',
    'game.answeredCount': '{a}/{n} đã trả lời',
    'game.answered': 'Đã trả lời',
    'game.thinking': 'Đang suy nghĩ',
    'game.wrong': 'Sai',
    'game.statusOpen': 'Đang nhận câu trả lời',
    'game.statusAll': 'Tất cả đội đã trả lời',
    'game.statusTimeUp': 'Hết giờ',
    'game.statusRevealed': 'Đã công bố đáp án',
    'game.nextHint': 'Mở gợi ý {n}',
    'game.showAnswer': 'Hiện đáp án',
    'game.nextQuestion': 'Câu tiếp theo',
    'game.toLeaderboard': 'Bảng xếp hạng',

    'play.yourAnswer': 'Đáp án của đội',
    'play.answerPlaceholder': 'Gõ đáp án, có dấu hay không đều được',
    'play.oneShot': 'Mỗi câu chỉ được chốt một lần. Chốt càng sớm, điểm càng cao.',
    'play.lockIn': 'Chốt đáp án',
    'play.sending': 'Đang gửi',
    'play.correct': 'Chính xác!',
    'play.incorrect': 'Chưa đúng',
    'play.youAnswered': 'Đội bạn đã trả lời',
    'play.waitOthers': 'Chờ các đội khác',
    'play.timeUp': 'Hết giờ',
    'play.timeUpBody': 'Câu này đã đóng. Xem đáp án trên màn hình lớn.',

    'reveal.correctWas': 'Đáp án đúng',
    'reveal.thisRound': 'Câu này',
    'reveal.rank': 'Hạng',
    'reveal.total': 'Tổng điểm',
    'reveal.waitNext': 'Chờ câu tiếp theo',

    'final.title': 'Kết quả',
    'final.ticker': 'Đội thắng: {name}',
    'final.tickerThanks': 'Cảm ơn các đội đã tham gia',
    'final.rematch': 'Chơi lại',
    'final.newSettings': 'Thiết lập mới',
    'final.yourRank': 'Hạng của đội',
    'final.thanks': 'Trò chơi đã kết thúc. Cảm ơn đội bạn!',
  },
  en: {
    'lang.label': 'Language',
    'common.home': 'Home',
    'common.points': 'points',
    'common.pts': 'pts',
    'common.seconds': '{n}s',
    'common.sec': 'sec',

    'landing.title': 'A live quiz for the whole class.',
    'landing.ticker1': 'Answer faster, score higher',
    'landing.ticker2': 'Up to 1000 points per question',
    'landing.ticker3': 'Convergent clues or multiple choice',
    'landing.ticker4': 'Scan the QR to walk on',
    'landing.hostSide': 'Lecturer · projector',
    'landing.hostTitle': 'Teaching today?',
    'landing.hostBody': 'Create a room, put the code on the big screen, open each question and announce the leaderboard.',
    'landing.hostCta': 'Create room',
    'landing.joinSide': 'Teams · phone',
    'landing.joinTitle': 'Join',
    'landing.joinBody': 'Enter the 6-digit room code on the big screen to play with your team.',
    'landing.joinCta': 'Join room',
    'landing.tabTip': 'Try it on one computer: open this page in two tabs. In the first, press “Create room”; in the second, enter the code to join. The tabs sync with each other.',

    'join.title': 'Join',
    'join.body': 'Enter the 6-digit room code from the lecturer’s screen.',
    'join.prefilled': 'The room code was filled in from the QR code. Check it, then press Join room.',
    'join.codeLabel': 'Room code',
    'join.checking': 'Finding room',
    'join.cta': 'Join room',

    'team.roomFound': 'Room {code}',
    'team.title': 'Team name',
    'team.body': 'Name your team. It will appear on the big screen.',
    'team.label': 'Team name',
    'team.placeholder': 'e.g. Econ Year 2',
    'team.joining': 'Joining',
    'team.cta': 'Join room',

    'wait.title': 'Waiting for the host to start',
    'wait.settingUp': 'The host is changing settings',
    'wait.teams': '{n} teams in the room',

    'error.notFound': 'No room with this code. Check the code on the big screen.',
    'error.noHost': 'The room host is not responding. Make sure the lecturer’s tab is still open.',
    'error.empty': 'Enter a team name.',
    'error.taken': 'That team name is taken. Pick another.',
    'error.full': 'The room is full. Ask the host to open a new one.',
    'error.kicked': 'Your team was removed from the room. You can rejoin with another name.',

    'closed.title': 'Room closed',
    'closed.body': 'The host has ended this room.',
    'closed.cta': 'Enter another code',

    'host.closeRoom': 'Close room',
    'host.exitConfirm': 'Close the room? All teams will be disconnected.',

    'setup.title': 'Room setup',
    'setup.subtitle': 'Pick a game type and the time per question. You can change them before you start.',
    'setup.modeHeading': 'Game type',
    'setup.questionCount': '{n} questions',
    'setup.maxPoints': 'up to 1000 pts each',
    'setup.timeHeading': 'Time per question',
    'setup.formulaLabel': 'Scoring',
    'setup.formula': 'Points = 1000 × time remaining ÷ total time',
    'setup.demo': 'Try it: a correct answer after {s} seconds',
    'setup.demoPoints': '{n} points',
    'setup.ready': '{mode} · {s}s per question',
    'setup.openRoom': 'Open room',

    'mode.clues': 'Convergent Clues',
    'mode.clues.desc': '4 hints converge on one answer. Teams type their answer at any time: guess earlier, score more.',
    'mode.standard': 'Standard Quiz',
    'mode.standard.desc': '1 question, 4 options A B C D. The faster the right pick, the higher the score.',

    'lobby.codeLabel': 'Room code',
    'lobby.goTo': 'Go to',
    'lobby.andEnter': 'and enter the code, or scan the QR.',
    'lobby.ticket': 'QR code',
    'lobby.gate': 'Gate',
    'lobby.qrTitle': 'Room join QR code',
    'lobby.scan': 'Scan with Zalo or your camera to join',
    'lobby.copy': 'Copy link',
    'lobby.copied': 'Copied',
    'lobby.openPlayer': 'Player tab',
    'lobby.teamsHeading': 'Teams',
    'lobby.empty': 'Waiting for the first team',
    'lobby.kick': 'Remove team {name}',
    'lobby.changeSettings': 'Change settings',
    'lobby.readyCount': '{n} teams ready',
    'lobby.needTeam': 'At least 1 team needed to start',
    'lobby.start': 'Start',
    'lobby.tickerWaiting': 'Waiting for teams',
    'lobby.tickerCount': '{n} teams in the room',
    'lobby.tickerScan': 'Scan the QR with Zalo or your camera',
    'lobby.tickerCode': 'Room code {code}',

    'game.question': 'Question',
    'game.mode': 'Game type',
    'game.livePoints': 'Points now',
    'game.livePointsAria': 'A correct answer now earns {n} points',
    'game.timeLeft': 'Time left',
    'game.cluesPrompt': 'This is',
    'game.hintLocked': 'Hint locked',
    'game.answerIs': 'Answer',
    'game.standings': 'Standings',
    'game.answeredCount': '{a}/{n} answered',
    'game.answered': 'Answered',
    'game.thinking': 'Thinking',
    'game.wrong': 'Wrong',
    'game.statusOpen': 'Taking answers',
    'game.statusAll': 'Every team has answered',
    'game.statusTimeUp': 'Time’s up',
    'game.statusRevealed': 'Answer revealed',
    'game.nextHint': 'Open hint {n}',
    'game.showAnswer': 'Show answer',
    'game.nextQuestion': 'Next question',
    'game.toLeaderboard': 'Leaderboard',

    'play.yourAnswer': 'Your team’s answer',
    'play.answerPlaceholder': 'Type the answer, accents optional',
    'play.oneShot': 'One answer per question. Lock in early to score more.',
    'play.lockIn': 'Lock in answer',
    'play.sending': 'Sending',
    'play.correct': 'Correct!',
    'play.incorrect': 'Not quite',
    'play.youAnswered': 'Your team answered',
    'play.waitOthers': 'Waiting for other teams',
    'play.timeUp': 'Time’s up',
    'play.timeUpBody': 'This question is closed. Watch the big screen for the answer.',

    'reveal.correctWas': 'Correct answer',
    'reveal.thisRound': 'This round',
    'reveal.rank': 'Rank',
    'reveal.total': 'Total score',
    'reveal.waitNext': 'Waiting for the next question',

    'final.title': 'Final results',
    'final.ticker': 'Winner: {name}',
    'final.tickerThanks': 'Thanks to every team',
    'final.rematch': 'Play again',
    'final.newSettings': 'New settings',
    'final.yourRank': 'Your team’s rank',
    'final.thanks': 'The game is over. Thanks for playing!',
  },
}

Object.assign(dict.vi, EXTRA.vi)
Object.assign(dict.en, EXTRA.en)

const LangContext = createContext(null)

function initialLang() {
  try {
    const saved = localStorage.getItem('mq-lang')
    if (saved === 'vi' || saved === 'en') return saved
  } catch {
    /* storage blocked */
  }
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'vi'
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next) => {
    setLangState(next)
    try {
      localStorage.setItem('mq-lang', next)
    } catch {
      /* storage blocked */
    }
  }, [])

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const { lang, setLang } = useContext(LangContext)
  const t = useCallback(
    (key, vars) => {
      const raw = dict[lang][key] ?? dict.en[key] ?? key
      return vars ? raw.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? '')) : raw
    },
    [lang],
  )
  /** Picks the current language from a bilingual { vi, en } object. */
  const tr = useCallback((obj) => (typeof obj === 'string' ? obj : obj ? (obj[lang] ?? obj.en ?? '') : ''), [lang])
  return { lang, setLang, t, tr }
}
