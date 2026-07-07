// 백업 파일에서 민감정보를 제외하기 위한 순수 유틸.
// 서버·클라이언트 어디서 import 해도 안전하도록 외부 의존성을 두지 않는다.

// 키(컬럼) 이름이 아래 패턴 중 하나에 매칭되면 값을 내보내지 않고 마스킹한다.
// 비밀번호 / 암호화값 / 각종 토큰 / API·시크릿 키 / 결제·카드 비밀값 / 주민번호 등.
const SENSITIVE_KEY_PATTERNS: RegExp[] = [
  /pass(word|wd)?/i,
  /secret/i,
  /token/i,
  /api[_-]?key/i,
  /access[_-]?key/i,
  /private[_-]?key/i,
  /client[_-]?secret/i,
  /encrypted/i,
  /\bsalt\b/i,
  /password[_-]?hash/i,
  /credential/i,
  /session[_-]?id/i,
  /\bcvv\b|\bcvc\b/i,
  /card[_-]?number/i,
  /\bpan\b/i, // primary account number
  /account[_-]?number/i,
  /routing[_-]?number/i,
  /ssn|social[_-]?security/i,
  /resident[_-]?registration|jumin/i, // 주민등록번호
  /otp[_-]?code/i,
  /auth[_-]?code/i,
];

export const REDACTION_MARKER = "***민감정보 제외됨***";

export function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERNS.some((re) => re.test(key));
}

// 객체/배열을 재귀적으로 순회하며 민감한 키의 값을 마스킹한다.
// 값을 통째로 지우지 않고 마커로 치환해, "이 필드는 존재하지만 백업에서 제외됐다"는 것을 투명하게 남긴다.
export function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((v) => sanitizeValue(v));
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = isSensitiveKey(k) ? REDACTION_MARKER : sanitizeValue(v);
    }
    return out;
  }
  return value;
}

export function sanitizeRows(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  return rows.map((row) => sanitizeValue(row) as Record<string, unknown>);
}

// --- CSV 변환 ---------------------------------------------------------------

function toCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str =
    typeof value === "object" ? JSON.stringify(value) : String(value);
  // 쉼표·따옴표·개행이 있으면 따옴표로 감싸고 내부 따옴표는 두 개로 이스케이프한다.
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// 행 배열을 CSV 문자열로 변환. 모든 행에 등장하는 키의 합집합을 헤더로 사용한다.
export function rowsToCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headerSet = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row)) headerSet.add(key);
  }
  const headers = [...headerSet];
  const lines = [headers.map(toCsvCell).join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => toCsvCell(row[h])).join(","));
  }
  // Excel 한글 깨짐 방지를 위해 BOM을 앞에 붙인다.
  return "﻿" + lines.join("\r\n");
}
