// 그림으로 배우는 생활안전 콘텐츠 스키마.
// 한 장(page)에는 그림(또는 이모지) + 큰 글씨 본문이 들어가고,
// 필요하면 사기 문자 예시(sms)나 고르기 문제(quiz)를 붙일 수 있다.
export type StoryQuizOption = {
  label: string;
  correct: boolean;
  feedback: string; // 고른 직후 보여줄 설명 (정답이든 오답이든 혼내지 않기)
};

export type StoryPage = {
  /** public/ 경로의 장면 그림. 없으면 emoji를 크게 보여준다 */
  img?: string;
  imgAlt?: string;
  emoji?: string;
  title: string;
  /** \n 으로 줄을 나눈 큰 글씨 본문 */
  text: string;
  /** 문자 메시지 예시 말풍선 (보이스피싱 교육용) */
  sms?: { from: string; body: string };
  quiz?: { question: string; options: StoryQuizOption[] };
};

export type Story = {
  id: string;
  title: string;
  badge: string; // 상단 배지 문구 (예: "🛡️ 그림으로 배우는 생활안전")
  pages: StoryPage[];
  finish: {
    title: string;
    text: string;
    shareText: string; // 공유하기로 보낼 문구
  };
};
