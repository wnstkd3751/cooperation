// 남은 일수(remain_days/dday)를 화면 표시 문구로 변환
// 양수: "유통기한 N일 남음" / 0: "오늘까지" / 음수: "유통기한 N일 지남"
export function formatDday(days) {
  if (days === null || days === undefined || isNaN(days)) {
    return "유통기한 정보 없음";
  }

  const n = Number(days);

  if (n > 0) return `유통기한 ${n}일 남음`;
  if (n === 0) return "오늘까지";
  return `유통기한 ${Math.abs(n)}일 지남`;
}