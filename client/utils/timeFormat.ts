import { format, parseISO, isValid } from "date-fns";

export function formatMomentTime(timestamp: string | number | Date): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) {
    return "刚刚";
  } else if (diffMs < hour) {
    return `${Math.floor(diffMs / minute)} 分钟前`;
  } else if (diffMs < day) {
    return `${Math.floor(diffMs / hour)} 小时前`;
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const postDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayDiff = (today.getTime() - postDay.getTime()) / day;

  if (dayDiff === 1) {
    return "昨天";
  } else if (dayDiff === 2) {
    return "前天";
  } else if (now.getFullYear() === date.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  } else {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
}

/**
 * 根据出生日期字符串计算年龄
 * @param birthDateStr - ISO 格式的出生日期字符串
 * @returns 年龄（整数）
 */
export function calculateAge(birthDateStr: string): number {
  const birthDate = new Date(birthDateStr);
  const now = new Date();

  let age = now.getFullYear() - birthDate.getFullYear();

  // 如果当前月份和日期早于出生月份和日期，则还没过生日，减一岁
  const hasBirthdayPassedThisYear =
    now.getMonth() > birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() &&
      now.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassedThisYear) {
    age--;
  }
  if (age > 60) {
    age = 0;
  }

  return age;
}

export function getDatePartWithDateFns(
  dateTimeString: string | null
): string | "" {
  if (!dateTimeString) return "";
  // 尝试将不同格式统一解析，parseISO 对 ISO 格式更佳
  // 对于 'YYYY-MM-DD HH:MM:SS' 可以用 parse 或手动替换空格为 T
  let dateObj: Date;
  if (dateTimeString.includes("T")) {
    dateObj = parseISO(dateTimeString);
  } else {
    // 尝试直接解析常见格式，或替换空格
    dateObj = new Date(dateTimeString.replace(" ", "T")); // 尝试转为类ISO
    // 如果格式更复杂，可能需要 date-fns 的 parse 函数指定格式
    // import { parse } from 'date-fns';
    // dateObj = parse(dateTimeString, 'yyyy-MM-dd HH:mm:ss', new Date());
  }

  // 检查解析是否有效
  if (!isValid(dateObj)) {
    console.error("无效的日期时间字符串 (date-fns):", dateTimeString);
    return "";
  }

  // 直接格式化为 YYYY-MM-DD
  return format(dateObj, "yyyy-MM-dd HH:MM:SS");
}
